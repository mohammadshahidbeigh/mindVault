// src/utils/auth.ts
import jwt from "jsonwebtoken";

export const generateToken = (userId: string): string => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "1h", // Token expiration time
  });

  // Debugging code
  console.log("Generated token:", token);
  const decoded = jwt.decode(token);
  console.log("Decoded token:", decoded);

  // Verify the token
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    console.log("Verified token:", verified);
  } catch (error) {
    console.error("Token verification failed:", error);
  }

  return token;
};
