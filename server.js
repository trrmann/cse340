// Main server file: Sets up Express app, routes, error handling, and view engine.
/* ***********************
 * Require Statements
 *************************/
const session = require('express-session');
const pool = require('./database/');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
// Load environment variables
const path = require('path');
const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'production' && !process.env.RENDER) {
  // Explicitly load .env.production.local if in production and not on Render
  dotenv.config({
    path: path.join(__dirname, '.env.production.local'),
    override: true,
  });
} else {
  dotenv.config();
}
const app = express();
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const errorRoute = require('./routes/errorRoute');
const utilities = require('./utilities/');
const accountRoute = require('./routes/accountRoute');

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  })
);

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

/* ***********************
 * View Engines and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout'); // not at views root

/* ***********************
 * Routes
 *************************/
// Serve static files directly from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Inventory routes
app.use('/inv', inventoryRoute);
// Account routes
app.use('/account', accountRoute);
// Error route for testing
app.use('/error', errorRoute);
// Index route
/*app.get("/", function(req, res){
  res.render("index", {title: "Home Changed Again with full Deploy"})
})*/
app.get('/', utilities.handleErrors(baseController.buildHome));
// File not found route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 * place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message;
  if (err.status == 404) {
    message = err.message;
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }
  res.status(err.status || 500);
  res.render('errors/error', {
    title: err.status || 'Server Error',
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

module.exports = app;
