// 📁 src/graphql/queries.ts
import { gql } from "@apollo/client";



export const GET_CATEGORIES = gql`
  query GetCategories {
    allCategories {
      id
      name
      image {
        url
      }
    }
  }
`;


export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      image {
        url
        key
      }
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      image {
        url
        key
      }
    }
  }
`;

export const DELETE_CATEGORY = gql`
mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id) {
    success
    message
  }
}
`;