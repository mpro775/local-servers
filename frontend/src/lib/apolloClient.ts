"use client";

import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLError } from "graphql";

type CustomGraphQLError = GraphQLError & {
  originalError?: Error; // جعله اختياريًا هنا
};

const uploadLink = createUploadLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:5000/graphql",
      headers: {
      "Apollo-Require-Preflight": "true"
    },   
  credentials: "same-origin", // أو "include" إذا كان الخادم يسمح بذلك
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorHandlerLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    if (response.errors) {
      response.errors = response.errors.map((error) => {
        const extensions = error.extensions || {};

        return new GraphQLError(
          getErrorMessage(extensions?.code as string | number), // Type assertion
          undefined, // nodes
          undefined, // source
          undefined, // positions
          undefined, // path
          (error as CustomGraphQLError).originalError,
          extensions
        );
      });
    }
    return response;
  });
});

const getErrorMessage = (code?: string | number) => {
  switch (code) {
    case "BAD_USER_INPUT":
    case 400:
      return "بيانات الدخول غير صحيحة";
    case "UNAUTHENTICATED":
    case 401:
      return "جلسة العمل منتهية، يرجى تسجيل الدخول مرة أخرى";
    case "FORBIDDEN":
    case 403:
      return "ليس لديك الصلاحية للقيام بهذا الإجراء";
    default:
      return "حدث خطأ غير متوقع";
  }
};

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorHandlerLink, uploadLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});


export default client;
