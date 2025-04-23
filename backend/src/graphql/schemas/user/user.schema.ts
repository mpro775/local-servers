import { gql } from "graphql-tag";

export const userSchema = gql`
  scalar ObjectID

  enum Role {
    USER
    PROVIDER
    ADMIN
  }

  type User {
    id: ID!
    email: String!
    role: Role!
    name: String
    firebaseUID: String
    isActive: Boolean
    services: [Service]
    bookings: [Booking]
    profile: ProviderProfile
    createdAt: Date!
    updatedAt: Date!
    walletBalance: Float!
    avgRating: Float
  }

  type ProviderProfile {
    phone: String
    description: String
    address: String
    profileImage: String
    serviceCategories: [Category]
    ratings: [Float]
  }

  input LoginInput {
    email: String!
    password: String
    firebaseUID: String
    adminSessionCheck: Boolean # أضف هذا الحقل الجديد
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
    role: Role!
    phone: String!
    description: String!
    firebaseUID: String
  }
  input ProfileInput {
    phone: String
    address: String
    description: String
  }

  input UpdateUserProfileInput {
    name: String
    profile: ProfileInput!
  }

  input UpdateProviderInput {
    name: String
    phone: String
    address: String
    profileImage: Upload
    categories: [ID!]
    description: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }
  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    role: String!
    isActive: Boolean
  }

  type DashboardStats {
    totalUsers: Int!
    totalProviders: Int!
    totalServices: Int!
    totalBookings: Int!
  }

  type Query {
    me: User
    adminUsers(role: String): [User!]!
    allProviders: [User]
    dashboardStats: DashboardStats!
    myBookings(status: RequestStatus): [Booking!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    registerAdmin(email: String!, password: String!, name: String): User
    updateMyProfile(input: UpdateUserProfileInput!): User!
    toggleUserStatus(id: ID!): Boolean
    createUserAsAdmin(input: CreateUserInput!): User!
  }
`;
