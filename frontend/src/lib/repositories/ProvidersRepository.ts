import { gql } from "@apollo/client";

export const GET_DASHBOARD_DATA = gql`
  query GetProviderDashboard {
    providerDashboard {
      totalServices
      activeBookings
      completedBookings
      totalEarnings
    }
    myServices {
      id
      title
      status
      price
      createdAt
      category {
        id
        name
      }
    }
  }
`;