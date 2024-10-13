// src/utils/auth.ts
import jwt from "jsonwebtoken";

export const generateToken = (userId: string): string => {
  const token = jwt.sign(
    {userId},
    process.env.JWT_SECRET_KEY || "myverysecretkey123456", // Ensure this key matches with the one used in server.ts
    {
      expiresIn: "7d", // Token expiration time
    }
  );

  // Debugging code
  console.log("Generated token:", token);
  const decoded = jwt.decode(token);
  console.log("Decoded token:", decoded);

  // Verify the token
  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "myverysecretkey123456"
    );
    console.log("Verified token:", verified);
  } catch (error) {
    console.error("Token verification failed:", error);
  }

  return token;
};
