import { NextFunction, Request, Response } from "express";
import { ISingleResponse } from "../types/generic";
import { ErrorResponse } from "../utils/error-response";
import { pool } from "../server";
import { v4 as uuid } from "uuid";
import { generateToken } from "../utils/generate-token";
import { IRequestWithUser, IUserResponse } from "../types/user";

export async function RegisterController(
  req: Request,
  res: ISingleResponse<IUserResponse>,
  next: NextFunction,
) {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return next(new ErrorResponse("Bad Request", 400));
  }

  const user_id = uuid();

  const [results, fields] = await pool.execute(
    "INSERT INTO `users` (user_id,email,password,username) VALUES (?,?,?,?)",
    [user_id, email, password, username],
  );

  const payload = {
    user_id: user_id,
  };

  const encode = generateToken(payload);

  const userResponse: IUserResponse = {
    token: encode,
    user: {
      email,
      username,
    },
  };
  res.status(201).json({
    data: userResponse,
    success: true,
    timestamp: Date.now(),
  });
}

export async function LoginController(
  req: Request,
  res: ISingleResponse<IUserResponse>,
  next: NextFunction,
) {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new ErrorResponse("Bad Request", 400));
  }

  const [results, fields] = await pool.execute(
    "SELECT * from `users` where username = ? ",
    [username],
  );

  const userData = (results as any)[0];

  if (!userData || userData.password !== password || !userData.user_id) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  const userId = Buffer.from(userData.user_id)
    .toString("utf-8")
    .replace(/\0/g, "");

  const payload = {
    user_id: userId,
  };

  const token = generateToken(payload);

  const userResponse: IUserResponse = {
    token,
    user: {
      email: userData.email,
      username: userData.username,
    },
  };

  res.status(201).json({
    data: userResponse,
    success: true,
    timestamp: Date.now(),
  });
}

export async function GetMe(
  req: Request,
  res: ISingleResponse<{ user: { email: string; username: string } }>,
  next: NextFunction,
) {
  const user_id = (req as IRequestWithUser).user_id;

  if (!user_id) {
    return next(
      new ErrorResponse("Unauthorize Request", 401, {
        AUTH: "USER_ID_MISSING",
      }),
    );
  }

  const [rows] = await pool.execute(
    "SELECT * FROM `users` WHERE TRIM(TRAILING '\0' FROM CAST(user_id AS CHAR)) = ?",
    [user_id],
  );

  const userData = (rows as any)[0];

  if (!userData) {
    return next(
      new ErrorResponse("Invalid Credentials", 401, {
        AUTH: "USER_NOT_FOUND",
      }),
    );
  }

  const userResponse = {
    user: {
      email: userData.email,
      username: userData.username,
    },
  };

  res.status(201).json({
    data: userResponse,
    success: true,
    timestamp: Date.now(),
  });
}
