/**
 * Global error handling middleware
 * Catches errors from routes and middleware, logs them, and returns appropriate responses
 *
 * This middleware should be registered LAST in the Express app
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error for debugging
  if (status >= 500) {
    console.error(`[${status}] ${message}`, err);
  } else {
    console.warn(`[${status}] ${message}`);
  }

  // Return error response
  res.status(status).json({
    error: message,
    status: status,
  });
};

module.exports = errorHandler;
