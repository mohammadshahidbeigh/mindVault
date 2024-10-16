// src/server.ts
import express, {Application} from "express";
import morgan from "morgan"; // Import morgan for logging
import {ApolloServer} from "apollo-server-express";
import {typeDefs} from "./graphql/schema";
import {resolvers} from "./graphql/resolvers";
import connectDB from "./db"; // Import the MongoDB connection
import jwt from "jsonwebtoken"; // For token verification
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import depthLimit from "graphql-depth-limit";
import cors from "cors";

// Load environment variables
dotenv.config();

const app: Application = express();

// Enable CORS
app.use(cors());

// Use morgan for logging requests
app.use(morgan("combined")); // You can change the format as needed

// Adds security headers
app.use(helmet());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

app.use("/graphql", apiLimiter);

// Add a root route handler
app.get("/", (req, res) => {
  res.send("Welcome to the MindVault API");
});

// Connect to MongoDB
connectDB();

// Create Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)], // Restrict query depth to 5 levels
  context: ({req}) => {
    try {
      const operationName = req.body?.operationName;
      const publicOperations = ["register", "login"];

      if (publicOperations.includes(operationName)) {
        if (process.env.NODE_ENV !== "production") {
          console.log(`Public operation '${operationName}', no auth required.`);
        }
        return {};
      }

      const authHeader = req.headers.authorization;
      if (process.env.NODE_ENV !== "production") {
        console.log("Authorization header:", authHeader);
      }

      if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (process.env.NODE_ENV !== "production") {
          console.log("Token:", token);
          console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
        }

        const decoded = jwt.decode(token);
        if (process.env.NODE_ENV !== "production") {
          console.log("Decoded token:", decoded);
        }

        try {
          const payload = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string
          ) as {userId: string};

          if (process.env.NODE_ENV !== "production") {
            console.log("Authenticated user from token:", payload.userId);
          }
          return {user: payload.userId};
        } catch (jwtError) {
          console.error("JWT verification failed:", jwtError);
          throw new Error("Invalid token");
        }
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn("No authorization header provided.");
        }
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
