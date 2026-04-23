const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, err?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  logger.error(`${req.method} ${req.url} - ${error.message}`);

  res.status(error.statusCode).json(response);
};

module.exports = errorMiddleware;
