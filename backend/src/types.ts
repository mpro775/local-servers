import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";

export enum Role {
  USER = "USER",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN",
}

export enum RequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  PAID = "PAID",
}

export interface CreateCategoryInput {
  name: string;
  image: FileUpload;
}

export interface UpdateCategoryInput {
  name?: string;
  image?: FileUpload;
}

export interface DeleteCategoryPayload {
  success: boolean;
  message: string;
}
export enum ServiceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BUSY = "BUSY",
  SUSPENDED = "SUSPENDED",
}
export interface IUserPayload {
  id: string;
  email: string;
  role: "USER" | "PROVIDER" | "ADMIN";
}

export interface IAuthToken {
  token: string;
  payload: IUserPayload;
}
export type AuthPayload = {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
};

export interface Context {
  user?: {
    id: string;
    email: string;
    role: "USER" | "PROVIDER" | "ADMIN";
  };
}
export interface CreateProviderInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  categories: string[];
  description: string;
}
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: Role;
  phone: string;
  description: string;
  firebaseUID: string;
  address: string;
}

export interface LoginInput {
  email: string;
  password: string;
  firebaseUID: string;
  adminSessionCheck:boolean;
}
