import { ApiError } from "../utils/ApiError.js";

const hasUnsafeKey = (value) => {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, nested]) => key.startsWith("$") || key.includes(".") || hasUnsafeKey(nested),
  );
};

export const sanitizeInput = (req, _res, next) => {
  if (hasUnsafeKey(req.body) || hasUnsafeKey(req.query) || hasUnsafeKey(req.params)) {
    return next(new ApiError(400, "Request contains unsupported input"));
  }
  next();
};
