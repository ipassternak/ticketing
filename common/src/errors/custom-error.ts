export class CustomError extends Error {
  name = 'CustomError';
  constructor(message: string, readonly statusCode: number) {
    super(message);
    Error.captureStackTrace(this);
  }
}
