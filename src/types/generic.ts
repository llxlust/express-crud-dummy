import { Response } from "express";

export interface ISingleResponse<T> extends Response {
  json: (body: ISingleReturn<T>) => this;
}

export interface ISingleReturn<T> {
  data: T;
  success: boolean;
  timestamp: number;
}

export interface IErrorRetrun {
  error: IError;
  success: boolean;
  timestamp: number;
}

export interface IError {
  message: string;
  field: Record<string, string>;
}

export interface IErrorResponse extends Response {
  json: (body: IErrorRetrun) => this;
}
