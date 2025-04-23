import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
        role
        profile {
          phone
          description
        }
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
        role
        profile {
          phone
          description
        }
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUserAsAdmin($input: CreateUserInput!) {
    createUserAsAdmin(input: $input) {
      id
      name
    }
  }
`;

export const GET_USERS = gql`
 query GetUsers($role: String) {
  adminUsers(role: $role) {
    id
    name
    email
    role
  }
}
`;

export const TOGGLE_USER_STATUS = gql`
  mutation ToggleUserStatus($id: ID!) {
    toggleUserStatus(id: $id)
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      id
      name
      profile { # تغيير هنا
        phone
        address
        description
      }
    }
  }
`;

export const UPDATE = gql`
  mutation UpdateProfile($input: UpdateUserProfileInput!) {
    updateMyProfile(input: $input) {
      id
      name
      profile {
        phone
        address
        description
      }
    }
  }
`;