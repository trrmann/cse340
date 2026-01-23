const invModel = require('../models/inventory-model');
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

/* ************************
 * Build the classification view HTML
 ************************** */

Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<div id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ************************
 * Build the item detail view HTML
 ************************** */

Util.buildItemDetailGrid = async function (data) {
  let grid;
  if (data && data.length > 0) {
    const vehicle = data[0];
    grid = '<div id="item-display">';
    grid += '<div class="item-image">';
    grid +=
      '<img src="' +
      vehicle.inv_image +
      '" alt="Image of ' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      ' on CSE Motors" />';
    grid += '</div>';
    grid += '<div class="item-details">';
    grid +=
      '<h2>' +
      vehicle.inv_year +
      ' ' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      '</h2>';
    grid +=
      '<p class="item-price">Price: $' +
      new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
      '</p>';
    grid += '<p class="item-description">' + vehicle.inv_description + '</p>';
    grid +=
      '<p class="item-color"><strong>Color:</strong> ' +
      vehicle.inv_color +
      '</p>';
    grid +=
      '<p class="item-miles"><strong>Miles:</strong> ' +
      new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +
      '</p>';
    grid += '</div>';
    grid += '</div>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
