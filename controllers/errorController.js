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

// error handling middleware defined here.
async function errorHandler(err, req, res, next) {
  try {
    let nav = '';
    const utilities = require('../utilities');
    nav = await utilities.getNav(req, res, next);
    res.status(err.status || 500).render('errors/error', {
      title: err.status || 'Server Error',
      message: err.message,
      error: err,
      nav,
    });
  } catch (error) {
    console.error('Error rendering error page:', error);
    res.status(500).send('An error occurred. Please try again later.');
  }
}

errorController.errorHandler = errorHandler;
module.exports = errorController;
