import { mergeResolvers } from "@graphql-tools/merge";
import userResolvers from "./user.resolvers";
import serviceResolvers from "./service.resolvers";
import categoryResolvers from "./category.resolvers";
import bookingResolvers from "./booking.resolvers";
import { GraphQLDateTime } from "graphql-scalars";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import reviewResolvers from "./review.resolvers";

const resolvers = mergeResolvers([
  userResolvers,
  serviceResolvers,
  categoryResolvers,
  bookingResolvers,
  reviewResolvers,
  {
    Date: GraphQLDateTime,
    Upload: GraphQLUpload,
  },
]);

export default resolvers;
