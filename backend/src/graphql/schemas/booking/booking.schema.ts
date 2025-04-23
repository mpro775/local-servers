import { gql } from "graphql-tag";

export const bookingSchema = gql`
  enum RequestStatus {
    PENDING
    ACCEPTED
    REJECTED
    COMPLETED
    CANCELLED
    PAID
  }

  type Booking {
    id: ID!
    service: Service!
    user: User!
    bookingDate: Date!
    status: RequestStatus!
    isCancelable: Boolean!
    canComplete: Boolean!
    isPaid: Boolean!
    review: Review

    createdAt: Date
    updatedAt: Date
  }

  type Review {
    id: ID!
    service: Service!
    user: User!
    rating: Int!
    comment: String
    createdAt: Date!
  }

  type PaymentIntent {
    clientSecret: String!
    paymentId: ID!
    amount: Int!
  }

  input UpdateBookingStatusInput {
    status: RequestStatus!
  }
  input AddReviewInput {
    bookingId: ID!
    rating: Int!
    comment: String
  }

  type ProviderDashboard {
    totalServices: Int!
    activeBookings: Int!
    completedBookings: Int!
    totalEarnings: Float!
  }

  type Query {
    getMyBookingForService(serviceId: ID!): Booking
    myBookings(status: RequestStatus): [Booking!]!
    providerBookings(status: RequestStatus): [Booking!]!
    allBookings(status: RequestStatus): [Booking!]!
    reviews(serviceId: ID!): [Review!]!
  }

  type Mutation {
    createBooking(serviceId: ID!): Booking!
    acceptBooking(id: ID!): Booking!
    rejectBooking(id: ID!): Booking!
    completeBooking(id: ID!): Booking!
    cancelBooking(id: ID!): Booking!
    confirmPayment(id: ID!, paymentIntent: String!): Booking!
    payBooking(id: ID!): Booking!
    processDummyPayment(id: ID!): Booking!
    startPayment(bookingId: ID!): PaymentIntent!
    confirmPayment(paymentId: ID!): Booking!
    addReview(input: AddReviewInput!): Review!
  }
`;
