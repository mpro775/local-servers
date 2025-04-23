import { gql } from "graphql-tag";

export const categorySchema = gql`
  type Category {
    id: ID!
    name: String!
    image: CategoryImage! 
  }

  type CategoryImage {
    url: String!
    key: String!
  }

  input CreateCategoryInput {
    name: String!
    image: Upload!
  }

  input UpdateCategoryInput {
    name: String
    image: Upload
  }
  type DeleteCategoryPayload {
    success: Boolean!
    message: String
  }

  type Query {
    allCategories: [Category]
    getCategories: [Category!]!
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): Category
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category
    deleteCategory(id: ID!): DeleteCategoryPayload!
  }
`;
