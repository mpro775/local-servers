// 1. المودل (Mongoose Schema)
import { Schema, model, Document } from "mongoose";

export interface IImage {
  url: string;
  key: string;
}

export interface ICategory extends Document {
  name: string;
  image: IImage; // يجب أن يكون كائنًا وليس حقولًا منفصلة
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  image: {
    url: { type: String, required: true }, // أضف required إذا كان الحقل مطلوبًا
    key: { type: String, required: true },
  },
});

export default model<ICategory>("Category", categorySchema);
