import { gql } from "@apollo/client";

export const GET_PROVIDER_BOOKINGS_ALL = gql`
  query GetProviderBookingsAll {
    providerBookings {
      id
      service { title }
      user    { name }
      bookingDate
      status
    }
  }
`;

export const ACCEPT_BOOKING = gql`
  mutation AcceptBooking($id: ID!) {
    acceptBooking(id: $id) {
      id
      status
    }
  }
`;

export const REJECT_BOOKING = gql`
  mutation RejectBooking($id: ID!) {
    rejectBooking(id: $id) {
      id
      status
    }
  }
`;
export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id) {
      id
      status
    }
  }
`;
export const PAY_BOOKING = gql`
  mutation ProcessDummyPayment($id: ID!) {
    processDummyPayment(id: $id) {
      id
      status
      isPaid
    }
  }
`;
export const GET_MY_BOOKINGS = gql`
  query GetMyBookings {
    myBookings {
      id
      service {
        id
        title
        price
        provider {
          id
          name
        }
      }
      bookingDate
      status
      isPaid
    }
  }
`;
export const GET_MY_BOOKING_FOR_SERVICE = gql`
  query GetMyBookingForService($serviceId: ID!) {
    getMyBookingForService(serviceId: $serviceId) {
      id
      status
      bookingDate
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking($serviceId: ID!) {
    createBooking(serviceId: $serviceId) {
      id
      status
      bookingDate
    }
  }
`;

export const CONFIRM_PAYMENT = gql`
  mutation ConfirmPayment($paymentId: ID!) {
    confirmPayment(paymentId: $paymentId) {
      id
      status
    }
  }
`;