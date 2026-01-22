/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const env = require('dotenv').config();
const app = express();
const static = require('./routes/static');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');

/* ***********************
 * View Engines and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout'); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);
// Inventory routes
app.use('/inv', inventoryRoute);
// Index route
/*app.get("/", function(req, res){
  res.render("index", {title: "Home Changed Again with full Deploy"})
})*/
app.get('/', baseController.buildHome);

/* ***********************
 * Error Handling Middleware
 *************************/
// 404 handler
app.use((req, res, next) => {
  res
    .status(404)
    .send(
      `<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p><p>Requested: ${req.url}</p>`
    );
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send(`<h1>500 - Server Error</h1><p>${err.message}</p>`);
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
