import { Types } from "mongoose";
import Service, { IService } from "../../models/Service";
import Booking from "../../models/Booking";
import { s3 } from "../../services/aws";
import { ServiceStatus } from "../../types";
import { GraphQLError } from "graphql";

interface Context {
  user?: {
    id: string;
    email: string;
    role: "USER" | "PROVIDER" | "ADMIN";
  };
}

const serviceResolvers = {
  Query: {
    myServices: async (
      _: unknown,
      __: unknown,
      { user }: Context
    ): Promise<IService[]> => {
      if (!user || user.role !== "PROVIDER") {
        throw new Error("Unauthorized");
      }
      return await Service.find({ provider: user.id })
        .populate("category")
        .populate("provider");
    },

    services: async (
      _: unknown,
      args: {
        category?: string;
        location?: string;
        priceMin?: number;
        priceMax?: number;
        page?: number;
        limit?: number;
        sortBy?: string;
        ratingMin?: number;
        search?: string;
      }
    ): Promise<{ services: IService[]; totalCount: number }> => {
      const {
        category,
        location,
        priceMin,
        priceMax,
        page = 1,
        limit = 10,
        sortBy,
        ratingMin,
        search,
      } = args;

      const filter: any = {};

      if (category) filter.category = category;

      if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) filter.price.$gte = priceMin;
        if (priceMax) filter.price.$lte = priceMax;
      }

      if (location) {
        const [lat, lng] = location.split(",").map(Number);
        const radiusInKm = 20;
        const radiusInRadians = radiusInKm / 6378.1;

        filter.location = {
          $geoWithin: {
            $centerSphere: [[lng, lat], radiusInRadians],
          },
        };
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      let sort: any = { createdAt: -1 };
      if (sortBy) {
        const [field, direction] = sortBy.split("_");
        sort = { [field]: direction === "DESC" ? -1 : 1 };
      }

      const rawServices = await Service.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category")
        .populate({
          path: "provider",
          populate: {
            path: "profile.serviceCategories",
            model: "Category",
          },
        });

      const totalCount = await Service.countDocuments(filter);

      const filteredServices =
        typeof ratingMin === "number"
          ? rawServices.filter((service) => {
              if (
                service.provider &&
                typeof service.provider === "object" &&
                "profile" in service.provider
              ) {
                const ratings = service.provider?.profile?.ratings || [];

                if (!ratings.length) return false;

                const avgRating =
                  ratings.reduce((acc: number, val: number) => acc + val, 0) /
                  ratings.length;

                return avgRating >= ratingMin;
              }
              return false;
            })
          : rawServices;

      return {
        services: filteredServices,
        totalCount,
      };
    },

    service: async (
      _: unknown,
      { id }: { id: string }
    ): Promise<IService | null> => {
      return await Service.findById(id)
        .populate("provider")
        .populate("category");
    },

    allServices: async (): Promise<IService[]> => {
      return await Service.find().populate("provider").populate("category");
    },

    providerDashboard: async (_: unknown, __: unknown, { user }: Context) => {
      if (!user || user.role !== "PROVIDER") throw new Error("Unauthorized");

      const [totalServices, services] = await Promise.all([
        Service.countDocuments({ provider: user.id }),
        Service.find({ provider: user.id }).select("_id"),
      ]);

      const serviceIds = services.map((s) => s._id);

      const [activeBookings, completedBookings, earningsResult] =
        await Promise.all([
          Booking.countDocuments({
            service: { $in: serviceIds },
            status: "ACCEPTED",
          }),
          Booking.countDocuments({
            service: { $in: serviceIds },
            status: "COMPLETED",
          }),
          Booking.aggregate([
            {
              $match: {
                service: { $in: serviceIds },
                status: "COMPLETED",
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "service",
              },
            },
            { $unwind: "$service" },
            {
              $group: {
                _id: null,
                total: { $sum: "$service.price" },
              },
            },
          ]),
        ]);

      return {
        totalServices,
        activeBookings,
        completedBookings,
        totalEarnings: earningsResult[0]?.total || 0,
      };
    },
  },

  Mutation: {
    createService: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          title: string;
          categoryId: Types.ObjectId;
          description: string;
          address: string;
          price: number;
          latitude: number;
          longitude: number;
          images: Promise<any>[];
        };
      },
      { user }: Context
    ) => {
      try {
        if (!user || user.role !== "PROVIDER") throw new Error("Unauthorized");

        const uploadedImages = await Promise.all(
          input.images.map(async (imagePromise, index) => {
            const image = await imagePromise;
            const { createReadStream, filename, mimetype } = await image;

            if (!mimetype.startsWith("image/")) {
              throw new Error(`File ${filename} is not an image`);
            }

            const Key = `services/${
              user.id
            }/${Date.now()}-${index}-${filename}`;

            const { Location: url } = await s3
              .upload({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key,
                Body: createReadStream(),
                ContentType: mimetype,
                ACL: "public-read", // لجعل الصور عامة
              })
              .promise();

            return { url, key: Key };
          })
        );

        const service = new Service({
          ...input,
          category: input.categoryId,
          provider: user.id,
          images: uploadedImages,
          location: {
            type: "Point",
            coordinates: [
              parseFloat(input.longitude.toFixed(6)),
              parseFloat(input.latitude.toFixed(6)),
            ],
          },
          status: "ACTIVE",
        });

        await service.save();
        return service;
      } catch (error) {
        console.error("Error creating service:", error);
        throw new Error("Failed to create service");
      }
    },

    updateService: async (
      _: unknown,
      { id, input }: { id: string; input: any },
      { user }: Context
    ): Promise<IService | null> => {
      if (!user) throw new Error("Not authorized");
      const service = await Service.findById(id);
      if (!service) throw new Error("Service not found");
      if (user.role === "PROVIDER" && service.provider.toString() !== user.id) {
        throw new Error("Not authorized to update this service");
      }
      const updates = { ...input };
      if (input.latitude && input.longitude) {
        updates.location = {
          type: "Point",
          coordinates: [input.longitude, input.latitude],
        };
      }
      return await Service.findByIdAndUpdate(id, updates, { new: true })
        .populate("category")
        .populate("provider");
    },

    deleteService: async (
      _: unknown,
      { id }: { id: string },
      { user }: Context
    ): Promise<IService> => {
      if (!user || user.role !== "ADMIN") throw new Error("Not authorized");
      const deletedService = await Service.findByIdAndDelete(id);
      if (!deletedService) throw new Error("Service not found");
      return deletedService;
    },

    updateServiceStatus: async (
      _: unknown,
      { id, status }: { id: string; status: ServiceStatus },
      { user }: Context
    ) => {
      if (!user || user.role !== "PROVIDER") {
        throw new Error("Unauthorized");
      }

      const service = await Service.findById(id);
      if (!service) throw new Error("Service not found");

      if (service.provider.toString() !== user.id) {
        throw new Error("You are not allowed to update this service");
      }

      service.status = status;
      await service.save();

      return service;
    },
    toggleServiceStatus: async (
      _: any,
      { id }: { id: string },
      { user }: Context
    ) => {
      if (!user || user.role !== "ADMIN") {
        throw new GraphQLError("غير مصرح لك");
      }

      const service = await Service.findById(id);
      if (!service) throw new GraphQLError("الخدمة غير موجودة");

      service.status =
        service.status === ServiceStatus.SUSPENDED
          ? ServiceStatus.ACTIVE
          : ServiceStatus.SUSPENDED;
      await service.save();

      return service;
    },
  },
};

export default serviceResolvers;
