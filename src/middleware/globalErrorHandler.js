const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  // Set default status code to 500 if not set
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  let error = { ...err };
  error.message = err.message;

  // Check if the error is an instance of ErrorHandler and has a status code
  if (err instanceof ErrorHandler) {
    error = err;
  } else {
    // For all other errors that are not instances of ErrorHandler
    if (error.message === "Movie URL is required") {
      error = new ErrorHandler(error.message, 400);
    } else if (error.message === "Could not extract IMDb ID from the provided URL") {
      error = new ErrorHandler(error.message, 400);
    } else if (error.message === "Could not fetch trailer URL") {
      error = new ErrorHandler(error.message, 500);
    } else {
      error = new ErrorHandler("Internal Server Error", 500);
    }
  }

  sendErrorResponse(res, error);
};

const sendErrorResponse = (res, error) => {
  res.status(error.statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};
