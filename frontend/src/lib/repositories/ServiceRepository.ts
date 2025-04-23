import { gql } from "@apollo/client";

export const GET_LATEST_SERVICES = gql`
  query GetLatestServices($limit: Int!) {
    services(limit: $limit, page: 1, sortBy: "createdAt_DESC") {
      services {
        id
        title
        description
        price
        images {
          url
        }
        category {
          name
        }
        provider {
          name
          avgRating
        }
        status
        createdAt
      }
    }
  }
`;

export const GET_SERVICES = gql`
  query GetServices(
    $search: String
    $category: String
    $priceMin: Float
    $priceMax: Float
    $page: Int
    $limit: Int
    $sortBy: String
    $ratingMin: Float
    $location: String
  ) {
    services(
      search: $search
      category: $category
      priceMin: $priceMin
      priceMax: $priceMax
      page: $page
      limit: $limit
      sortBy: $sortBy
      ratingMin: $ratingMin
      location: $location
    ) {
      services {
        id
        title
        description
        price
        images {
          url
        }
        address
        status
        category {
          name
        }
        provider {
          name
          avgRating
        }
        createdAt
      }
      totalCount
    }
  }
`;

export const GET_SERVICES_ADMIN = gql`
  query GetServices {
    allServices {
      id
      title
      price
      address
      category {
        id
        name
      }
      provider {
        id
        name
      }
    }
  }
`;

export const TOGGLE_SERVICE_STATUS = gql`
  mutation ToggleServiceStatus($id: ID!) {
    toggleServiceStatus(id: $id) {
      id
      status
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      title
      description
      price
      address
      status
      category { id name }
    }
  }
`;
export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
      title
    }
  }
`;
export const UPDATE_SERVICE_STATUS = gql`
  mutation UpdateServiceStatus($id: ID!, $status: ServiceStatus!) {
    updateServiceStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      id
    }
  }
`;

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    service(id: $id) {
      id
      title
      description
      price
      images { url }
      address
      location { type coordinates }
      category { name }
      provider { name avgRating }
      status
      createdAt
    }
  }
`;