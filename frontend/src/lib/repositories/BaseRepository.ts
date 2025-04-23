import { gql } from "@apollo/client";

export const GET_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalUsers
      totalProviders
      totalServices
      totalBookings
    }
  }
`;