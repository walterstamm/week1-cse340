const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required class="select-classification">'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}




/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }




  /* **************************************
  * Build the detailed vehicle view
  * ************************************ */
  Util.buildVehicleDetail = function(vehicle){
    let html = '<div class="vehicle-detail">';
    html += `<h2>${vehicle.inv_make} ${vehicle.inv_model} ${vehicle.inv_year}</h2>`;
    html += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`;
    html += `<p class="description">${vehicle.inv_description}</p>`;
    html += '<div class="details">';
    html += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`;
    html += `<p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>`;
    html += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
    html += '</div>';
    html += '</div>';
    return html;
  }


  /* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {

   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
    console.log("No token found")
   next()
  }
 }


 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Employee
 * ************************************ */
 Util.checkEmployee = (req, res, next) => {
  if (res.locals.accountData.account_type === 'Employee') {
    next()
  } else {
    req.flash("notice", "You are not authorized to access this page.")
    return res.redirect("/")
  }
 }

  /* ****************************************
 *  Check Admin
 * ************************************ */
 Util.checkAdmin = (req, res, next) => {
  if (res.locals.accountData.account_type === 'Admin') {
    next()
  } else {
    req.flash("notice", "You are not authorized to access this page.")
    return res.redirect("/")
  }
 }


  /* ****************************************
 *  Check permisson to edit inventory
 * ************************************ */
 Util.checkInventoryEditPermission = (req, res, next) => {
  if (res.locals.accountData.account_type === 'Admin' || res.locals.accountData.account_type === 'Employee') {
    next()
  } else {
    req.flash("notice", "You are not authorized to edit this inventory.")
    return res.redirect("/")
  }
 }

 


 Util.buildUserList =  function(data){
  let table = '<table class="user-list-table"><thead><tr><th class="table-header">First Name</th><th class="table-header">Last Name</th><th class="table-header">Email</th><th class="table-header">Type</th><th class="table-header">Change Role</th></tr></thead><tbody>'
  data.forEach((row) => {
    table += '<tr><td class="table-data">' + row.account_firstname + '</td><td class="table-data">' + row.account_lastname +
    '</td><td class="table-data">' + row.account_email + '</td><td class="table-data">' + row.account_type + 
    '</td><td class="table-data"><a class="change-role-link" href="/account/change-role/' + row.account_id + 
    '">Change Role</a></td></tr>'
  })
  table += '</tbody></table>'
  return table
 }



  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util