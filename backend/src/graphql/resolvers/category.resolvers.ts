import { GraphQLError } from "graphql";
import Category, { ICategory } from "../../models/Category";
import { s3 } from "../../services/aws"; // تأكد من إعداد AWS S3 بشكل صحيح
import {
  Context,
  CreateCategoryInput,
  DeleteCategoryPayload,
  UpdateCategoryInput,
} from "../../types";

const categoryResolvers = {
  Query: {
    allCategories: async (): Promise<ICategory[]> => {
      return await Category.find();
    },
    getCategories: async (): Promise<ICategory[]> => {
      return await Category.find().exec();
    },
  },

  Mutation: {
    createCategory: async (
      _: unknown,
      { input }: { input: CreateCategoryInput },
      { user }: Context
    ) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      const { createReadStream, filename, mimetype } = await input.image;

      const Key = `categories/${Date.now()}-${filename}`;
      const { Location: url, Key: key } = await s3
        .upload({
          Bucket: "local-services-test",
          Key,
          Body: createReadStream(),
          ContentType: mimetype,
        })
        .promise();

      return Category.create({
        name: input.name,
        image: { url, key },
      });
    },

    updateCategory: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateCategoryInput },
      { user }: Context
    ): Promise<ICategory> => {
      try {
        if (!user || user.role !== "ADMIN") {
          throw new GraphQLError("غير مصرح بالوصول", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        // البحث عن الفئة
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
          throw new GraphQLError("الفئة غير موجودة", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const updateData: Partial<ICategory> = {
          name: input.name || existingCategory.name,
        };

        if (input.image) {
          const { createReadStream, filename, mimetype } = await input.image;
          const newKey = `categories/${Date.now()}_${filename}`;

          await s3
            .upload({
              Bucket: process.env.AWS_BUCKET_NAME!,
              Key: newKey,
              Body: createReadStream(),
              ContentType: mimetype,
            })
            .promise();

          if (existingCategory.image?.key) {
            await s3
              .deleteObject({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: existingCategory.image.key,
              })
              .promise();
          }

          updateData.image = {
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${newKey}`,
            key: newKey,
          };
        }

        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        ).orFail();

        return updatedCategory.toObject({ versionKey: false });
      } catch (error) {
        console.error("Update Category Error:", error);
        throw new GraphQLError("فشل في تحديث الفئة", {
          extensions: {
            code: "UPDATE_FAILED",
            originalError:
              error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    },

    deleteCategory: async (
      _: unknown,
      { id }: { id: string },
      { user }: Context
    ): Promise<DeleteCategoryPayload> => {
      if (!user || user.role !== "ADMIN") {
        return {
          success: false,
          message: "Unauthorized",
        };
      }
      const category = await Category.findById(id);
      if (!category) {
        return {
          success: false,
          message: "Category not found",
        };
      }

      if (category.image?.key) {
        await s3
          .deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: category.image.key,
          })
          .promise();
      }

      await Category.deleteOne({ _id: id });
      return {
        success: true,
        message: "Category deleted successfully",
      };
    },
  },
};

export default categoryResolvers;
