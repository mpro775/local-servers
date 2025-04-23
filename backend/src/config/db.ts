import mongoose from "mongoose";
import User from "../models/User";
import bcrypt from "bcrypt";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    mongoose.set("returnOriginal", false);
    mongoose.set("toObject", { virtuals: true });
    mongoose.set("toJSON", { virtuals: true });

    await seedAdminAccount();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedAdminAccount = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.log("Admin credentials not provided in .env");
    return;
  }
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      name: "Super Admin",
      role: "ADMIN",
    });
    await admin.save();
    console.log("Main admin account created successfully");
  } else {
    console.log("Admin account already exists");
  }
};
