import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { typeDefs } from "./graphql/schemas";
import resolvers from "./graphql/resolvers";
import { authenticate } from "./middleware/auth"; // التصحيح هنا

dotenv.config();

const startServer = async () => {
  const app = express();

  await connectDB();

  app.use(graphqlUploadExpress());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const server = new ApolloServer({
    typeDefs,
    resolvers, // إزالة context من هنا
  });

  await server.start();

  app.use(
    "/graphql",
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const publicOperations = ["login", "register", "registerProvider"];
        const operationName = req.body.operationName;

        if (publicOperations.includes(operationName)) {
          return {};
        }

        return { user: authenticate(req) }; // استخدام الدالة الجديدة
      },
    })
  );

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
};

startServer();
