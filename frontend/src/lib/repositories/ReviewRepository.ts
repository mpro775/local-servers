import { gql } from "@apollo/client";

export const ADD_REVIEW = gql`
  mutation AddReview($input: AddReviewInput!) {
    addReview(input: $input) {
      id
      rating
      comment
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const GET_REVIEWS = gql`
  query Reviews($serviceId: ID!) {
    reviews(serviceId: $serviceId) {
      id
      rating
      comment
      createdAt
      user {
        id
        name
      }
    }
  }
`;
