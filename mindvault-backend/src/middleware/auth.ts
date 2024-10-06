// src/middleware/auth.ts
import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

interface AuthRequest extends Request {
  user?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const publicOperations = ["register", "login"];

  if (
    req.method === "POST" &&
    req.body.query &&
    publicOperations.some((op) => req.body.query.includes(op))
  ) {
    // Skip auth for public operations
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, "your_jwt_secret_key") as {
        userId: string;
      };
      req.user = payload.userId;
      next();
    } catch {
      res.status(401).send({error: "Unauthorized"});
    }
  } else {
    res.status(401).send({error: "Unauthorized"});
  }
};
