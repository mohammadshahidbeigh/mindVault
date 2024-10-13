import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

// Extend Request interface to include user
interface AuthRequest extends Request {
  user?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const publicOperations = ["register", "login"];

  // Skip authentication for public operations
  if (
    req.method === "POST" &&
    req.body.query &&
    publicOperations.some((op) => req.body.query.includes(op))
  ) {
    console.log("Public operation, skipping authentication.");
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extract token
    console.log("Authorization header found. Token:", token);

    try {
      // Verify token
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      ) as {userId: string};
      req.user = payload.userId; // Set user ID
      console.log("User authenticated. UserId:", req.user);
      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("JWT verification failed:", error.message);
        res
          .status(401)
          .json({error: "Invalid or expired token", message: error.message});
      } else {
        res.status(401).json({error: "Invalid or expired token"});
      }
    }
  } else {
    console.warn("Authorization header missing.");
    res.status(401).json({error: "Authorization header missing"});
  }
};
