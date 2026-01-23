const errorController = {};

/* *********************************
 * Intentional Error for Testing
 * Trigger a 500 error to test error handling
 * ********************************** */
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
