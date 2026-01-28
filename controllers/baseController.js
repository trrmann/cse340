// Base Controller: Handles home page rendering and main site logic.

const utilities = require('../utilities/');
const baseController = {};

// Renders the home page with navigation and featured content.
baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  req.flash("notice","This is a flash message.");
  res.render('index', { title: 'Home', nav });
};

module.exports = baseController;
