// src/server.ts
import express, {Application} from "express";
import {ApolloServer} from "apollo-server-express";
import {typeDefs, resolvers} from "./graphql/schema";
import connectDB from "./db"; // Import the MongoDB connection
import jwt from "jsonwebtoken"; // For token verification

const app: Application = express();

// Connect to MongoDB
connectDB();

// Create Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    try {
      // Extract the operation name from the request body
      const operationName = req.body?.operationName;

      // Allow public access for playground and introspection queries
      const isPlaygroundRequest =
        req.body?.query && req.body.query.includes("IntrospectionQuery");

      const publicOperations = ["register", "login"];

      if (
        isPlaygroundRequest ||
        !operationName ||
        publicOperations.includes(operationName)
      ) {
        return {};
      }

      // For other operations, apply authentication check
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
          const payload = jwt.verify(token, "your_jwt_secret_key") as {
            userId: string;
          };
          return {user: payload.userId};
        } catch (jwtError) {
          console.error("JWT verification failed:", jwtError);
          throw new Error("Invalid token");
        }
      } else {
        // Instead of throwing an error, return an object with no user
        console.warn("No authorization header provided");
        return {user: null};
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // Return an object with no user instead of throwing an error
      return {user: null};
    }
  },
});

// Apply Apollo middleware to Express
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({app});

  // Start Express server
  app.listen({port: 4000}, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}

startApolloServer();
