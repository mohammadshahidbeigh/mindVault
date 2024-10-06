// src/utils/auth.ts
import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  return jwt.sign({userId}, "your_jwt_secret_key", {expiresIn: "1h"});
};
