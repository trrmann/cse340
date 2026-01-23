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
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li class="vehicle-card">';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" class="vehicle-card-link" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">';
      grid += '<div class="vehicle-image-wrapper">';
      grid +=
        '<img src="' +
        vehicle.inv_thumbnail +
        '" alt="' +
        vehicle.inv_year +
        ' ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '" class="vehicle-image" />';
      grid += '</div>';
      grid += '<div class="vehicle-info">';
      grid += '<h2 class="vehicle-name">';
      grid += vehicle.inv_make + ' ' + vehicle.inv_model;
      grid += '</h2>';
      grid +=
        '<p class="vehicle-price" aria-label="Price">$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</p>';
      grid += '</div>';
      grid += '</a>';
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
    grid = '<div id="item-display" class="detail-container">';
    grid += '<div class="detail-image-section">';
    grid += '<div class="detail-image-wrapper">';
    grid +=
      '<img src="' +
      vehicle.inv_image +
      '" alt="' +
      vehicle.inv_year +
      ' ' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      '" class="detail-image" />';
    grid += '</div>';
    grid += '</div>';
    grid += '<div class="detail-info-section">';
    grid += '<div class="detail-header">';
    grid +=
      '<h2 class="detail-title">' +
      vehicle.inv_year +
      ' ' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      '</h2>';
    grid +=
      '<p class="detail-price" aria-label="Price">$' +
      new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
      '</p>';
    grid += '</div>';
    grid += '<div class="detail-description">';
    grid += '<p>' + vehicle.inv_description + '</p>';
    grid += '</div>';
    grid += '<div class="detail-specs">';
    grid += '<div class="spec-item">';
    grid += '<span class="spec-label">Color</span>';
    grid += '<span class="spec-value">' + vehicle.inv_color + '</span>';
    grid += '</div>';
    grid += '<div class="spec-item">';
    grid += '<span class="spec-label">Mileage</span>';
    grid +=
      '<span class="spec-value">' +
      new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +
      ' miles</span>';
    grid += '</div>';
    grid += '</div>';
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
