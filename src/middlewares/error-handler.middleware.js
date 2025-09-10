export const errorHandler = (err, req, res, next) => {
  // Handle malformed JSON error (SyntaxError from express.json parser)
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Invalid JSON format.",
      code: "BAD_REQUEST",
    });
  }

  // Handle custom AppError
  if (err.name === "AppError") {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
      code: err.code,
    });
  }

  // Default catch-all error
  return res.status(500).json({
    success: false,
    data: null,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
};