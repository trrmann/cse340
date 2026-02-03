const utilities = require('../utilities/index');
const accountModel = require('../models/account-model');

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegistration(req, res, next) {
  try {
    let nav = await utilities.getNav(req, res, next);
    // Pull errors and form values from session if present
    const errors = req.session.regErrors || null;
    const form = req.session.regForm || {};
    // Clear them from session after use
    req.session.regErrors = null;
    req.session.regForm = null;
    res.render('account/registration', {
      title: 'Registration',
      nav,
      message: '',
      errors,
      account_firstname: form.account_firstname || '',
      account_lastname: form.account_lastname || '',
      account_email: form.account_email || '',
    });
  } catch (error) {
    console.error('Error in buildRegistration:', error);
    next(error);
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      'notice',
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.redirect('/account/login');
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('account/registration', {
      title: 'Registration',
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav(req, res, next);
    const message = req.flash('notice');
    res.render('account/login', {
      title: 'Login',
      nav,
      message,
      errors: null,
    });
  } catch (error) {
    console.error('Error in buildLogin:', error);
    next(error);
  }
}

// Placeholder handler for '/account' route
function accountErrorHandler(req, res, next) {
  // Example: just call next() to continue to error handler
  next();
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountError: accountErrorHandler,
};
