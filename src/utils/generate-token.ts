import jwt from "jsonwebtoken";
import "dotenv/config";
import { ErrorResponse } from "./error-response";
export const generateToken = (payload: Record<string, unknown>): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ErrorResponse("Token Encoding Conflict", 409);
  }
  const token = jwt.sign(payload, secret);
  return token;
};
