// src/server.ts
import express, {Application} from "express";
import {ApolloServer} from "apollo-server-express";
import {typeDefs, resolvers} from "./graphql/schema";
import connectDB from "./db"; // Import the MongoDB connection

const app: Application = express();

// Connect to MongoDB
connectDB();

// Create Apollo server
const server = new ApolloServer({typeDefs, resolvers});

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
