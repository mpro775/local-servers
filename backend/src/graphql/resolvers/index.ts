import { mergeResolvers } from "@graphql-tools/merge";
import userResolvers from "./user.resolvers";
import serviceResolvers from "./service.resolvers";
import categoryResolvers from "./category.resolvers";
import bookingResolvers from "./booking.resolvers";
import { GraphQLDateTime } from "graphql-scalars";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";

const resolvers = mergeResolvers([
  userResolvers,
  serviceResolvers,
  categoryResolvers,
  bookingResolvers,
  {
    Date: GraphQLDateTime,
    Upload: GraphQLUpload,
  },
]);

export default resolvers;
