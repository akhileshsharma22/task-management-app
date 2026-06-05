import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "An account with that email already exists";
  }

  const response = { success: false, message, data: null };
  if (err.details) response.errors = err.details;
  if (process.env.NODE_ENV !== "production" && !(err instanceof ApiError)) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
