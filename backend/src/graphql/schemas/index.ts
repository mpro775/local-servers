import { gql } from "graphql-tag";
import { userSchema } from "./user/user.schema";
import { serviceSchema } from "./service/service.schema";
import { categorySchema } from "./category/category.schema";
import { bookingSchema } from "./booking/booking.schema";

export const typeDefs = gql`
  ${userSchema}
  ${serviceSchema}
  ${categorySchema}
  ${bookingSchema}
`;
