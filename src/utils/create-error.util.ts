import { ErrorType } from "../types"

const createError = (statusCode: number, message: string) => {
  const error: ErrorType = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export default createError;