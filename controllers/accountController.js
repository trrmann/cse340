const utilities = require('../utilities/index');

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav(req, res, next);
    res.render('account/login', {
      title: 'Login',
      nav,
      message: '',
    });
  } catch (error) {
    next(error);
  }
}

// Placeholder handler for '/account' route
function accountErrorHandler(req, res, next) {
  // Example: just call next() to continue to error handler
  next();
}

module.exports = { buildLogin, accountError: accountErrorHandler };
