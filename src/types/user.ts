import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IUserResponse {
  token: string;
  user: {
    email: string;
    username: string;
  };
}

export interface IJwtPayloadWithUser extends JwtPayload {
  user_id: string;
}

export interface IRequestWithUser extends Request {
  user_id: string;
}
