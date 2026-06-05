export class ErrorResponse extends Error {
  message: string;
  status: number;
  source: Record<string, string>;
  constructor(
    msg: string,
    code: number,
    fieldsErrors: Record<string, string> = {},
  ) {
    super(msg);
    this.message = msg;
    this.status = code;
    this.source = fieldsErrors;
  }
}
