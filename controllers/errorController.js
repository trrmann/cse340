// Error Controller: Handles intentional error generation for testing error handling middleware.

const errorController = {};

// Triggers a 500 error for testing error handling middleware.
errorController.triggerError = async function (req, res, next) {
  try {
    // Intentionally trigger a 500 error
    const error = new Error(
      'Intentional 500 error triggered for testing purposes.'
    );
    error.status = 500;
    throw error;
  } catch (error) {
    next(error);
  }
};

module.exports = errorController;
