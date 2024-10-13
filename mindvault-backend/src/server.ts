// src/server.ts
import express, {Application} from "express";
import {ApolloServer} from "apollo-server-express";
import {typeDefs, resolvers} from "./graphql/schema";
import connectDB from "./db"; // Import the MongoDB connection
import jwt from "jsonwebtoken"; // For token verification
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app: Application = express();

// Connect to MongoDB
connectDB();

// Create Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    try {
      const operationName = req.body?.operationName;
      const publicOperations = ["register", "login"];

      if (publicOperations.includes(operationName)) {
        console.log(`Public operation '${operationName}', no auth required.`);
        return {};
      }

      const authHeader = req.headers.authorization;
      console.log("Authorization header:", authHeader);

      if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log("Token:", token);

        // Check if the secret key is loaded correctly
        console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

        const decoded = jwt.decode(token);
        console.log("Decoded token:", decoded);

        try {
          const payload = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY || "myverysecretkey123456" // Use hardcoded secret temporarily
          ) as {userId: string};

          console.log("Authenticated user from token:", payload.userId);
          return {user: payload.userId};
        } catch (jwtError) {
          console.error("JWT verification failed:", jwtError);
          throw new Error("Invalid token");
        }
      } else {
        console.warn("No authorization header provided.");
        return {user: null};
      }
    } catch (error: unknown) {
      console.error(
        "Error in context authentication:",
        (error as Error).message
      );
      return {user: null};
    }
  },
});

// Apply Apollo middleware to Express
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({app});

  // Start Express server
  const port = process.env.PORT || 4000;
  app.listen({port}, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
}

startApolloServer();
