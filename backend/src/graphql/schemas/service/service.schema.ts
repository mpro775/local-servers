import { gql } from "graphql-tag";

export const serviceSchema = gql`
  enum ServiceStatus {
    ACTIVE
    BUSY
    INACTIVE
    SUSPENDED
  }

  scalar PositiveFloat
  scalar ObjectID
  scalar Date
  scalar Upload

  type Category {
    id: ID!
    name: String!
  }

  type Location {
    type: String
    coordinates: [Float]
  }

  type Image {
    url: String!
    key: String!
  }

  type Service {
    id: ID!
    title: String!
    category: Category!
    description: String
    price: Float!
    images: [Image!]!
    address: String
    location: Location
    provider: User!
    status: ServiceStatus!
    createdAt: Date
    updatedAt: Date
    avgRating: Float
    distance: Float
  }

  input CreateServiceInput {
    title: String!
    categoryId: ID!
    description: String!
    address: String!
    price: PositiveFloat!
    latitude: Float!
    longitude: Float!
    images: [Upload!]!
  }

  input UpdateServiceInput {
    title: String
    categoryId: ID
    description: String
    price: Float
    address: String
    latitude: Float
    longitude: Float
    images: [Upload!]
    status: ServiceStatus
  }

  input LocationFilterInput {
    latitude: Float!
    longitude: Float!
    radius: Float! # بالكيلومتر
  }

  type ProviderDashboard {
    totalServices: Int!
    activeBookings: Int!
    completedBookings: Int!
    totalEarnings: Float!
  }
  type ServicesResult {
    services: [Service!]!
    totalCount: Int!
  }

  type Query {
    services(
      category: String
      location: String
      priceMin: Float
      priceMax: Float
      page: Int
      limit: Int
      sortBy: String
      ratingMin: Float
      search: String
    ): ServicesResult!

    service(id: ID!): Service
    allServices: [Service]
    myServices: [Service]
    providerDashboard: ProviderDashboard!
  }

  type Mutation {
    createService(input: CreateServiceInput!): Service
    updateService(id: ID!, input: UpdateServiceInput!): Service
    deleteService(id: ID!): Service
    updateServiceStatus(id: ID!, status: ServiceStatus!): Service
    toggleServiceStatus(id: ID!): Service!
  }
`;
