import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/error-response";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { IJwtPayloadWithUser, IRequestWithUser } from "../types/user";
export async function AuthGuard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(
        new ErrorResponse("Unauthorize Request", 401, {
          AUTH: "TOKEN_MISSING",
        }),
      );
    }

    const decode_payload = jwt.verify(token, process.env.JWT_SECRET || "");

    if (!decode_payload) {
      return next(
        new ErrorResponse("Unauthorize Request", 401, {
          AUTH: "TOKEN_MISSING",
        }),
      );
    }

    const user_id = (decode_payload as IJwtPayloadWithUser).user_id;

    if (!user_id) {
      return next(
        new ErrorResponse("Unauthorize Request", 401, {
          AUTH: "USER_ID_MISSING",
        }),
      );
    }

    (req as IRequestWithUser).user_id = user_id;

    next();
  } catch (error) {
    next(new ErrorResponse("Internal Erorr", 500));
  }
}
