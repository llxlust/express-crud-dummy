import { NextFunction, Request } from "express";
import { IErrorResponse } from "../types/generic";
import { ErrorResponse } from "../utils/error-response";

export const ErrroHandler = (
  err: ErrorResponse,
  req: Request,
  res: IErrorResponse,
  next: NextFunction,
) => {
  const errMsg = err.message || "Internal Error";
  const errStatus = err.status || 500;
  const errField = err.source || "Database";
  res.status(errStatus).json({
    error: { message: errMsg, field: errField },
    success: false,
    timestamp: Date.now(),
  });
};
