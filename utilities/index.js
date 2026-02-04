const Util = {};
const invModel = require('../models/inventory-model');
// Returns a select list of classifications for inventory forms.
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += ' selected ';
    }
    classificationList += '>' + row.classification_name + '</option>';
  });
  classificationList += '</select>';
  return classificationList;
};
// Utility functions for navigation, grid, and item detail HTML generation.

// Returns navigation HTML as an unordered list.
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

// Returns HTML grid for displaying vehicles in a classification.
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
        '" class="vehicle-image">';
      grid += '</div>';
      grid += '<div class="vehicle-info">';
      grid += '<h2 class="vehicle-name">';
      grid += vehicle.inv_make + ' ' + vehicle.inv_model;
      grid += '</h2>';
      grid +=
        '<div class="vehicle-price-wrapper"><span class="sr-only">Price: </span><data class="vehicle-price" value="' +
        vehicle.inv_price +
        '" aria-hidden="true">$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</data></div>';
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

// Returns HTML for a single vehicle's detail view.
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
      '" class="detail-image">';
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
      '<div class="detail-price-wrapper"><span class="sr-only">Price: </span><data class="detail-price" value="' +
      vehicle.inv_price +
      '" aria-hidden="true">$' +
      new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
      '</data></div>';
    grid += '</div>';
    grid += '<div class="detail-description">';
    grid += '<p>' + vehicle.inv_description + '</p>';
    grid += '</div>';
    grid += '<dl class="detail-specs">';
    grid += '<div class="spec-item">';
    grid += '<dt class="spec-label">Color</dt>';
    grid += '<dd class="spec-value">' + vehicle.inv_color + '</dd>';
    grid += '</div>';
    grid += '<div class="spec-item">';
    grid += '<dt class="spec-label">Mileage</dt>';
    grid +=
      '<dd class="spec-value">' +
      new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +
      ' miles</dd>';
    grid += '</div>';
    grid += '</dl>';
    grid += '</div>';
    grid += '</div>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  return grid;
};

// Express middleware wrapper for async error handling.
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
