export const sendSuccess = (res, { statusCode = 200, message = "Request successful", data = {} } = {}) =>
  res.status(statusCode).json({ success: true, message, data });
