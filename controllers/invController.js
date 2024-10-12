const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const vehicleDetail = utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    vehicleDetail,
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  res.render("./inventory/management",
    {
      title: "Vehicle Management",
      nav: await utilities.getNav(),
      errors: null,
      notice: req.flash("notice"),
    } 
  )
}


/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav: await utilities.getNav(),
    errors: null,
    notice: req.flash("notice"),
  })
}



/* ***************************
 *  Add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const classification_name = req.body.classification_name
  const data = await invModel.addClassification(classification_name)
  req.flash("notice", "New classification added")
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav: await utilities.getNav(),
    errors: null,
    notice: req.flash("notice"),
  })
}


invCont.buildAddInventory = async function (req, res, next) {
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav: await utilities.getNav(),
    classificationList: await utilities.buildClassificationList(),
    errors: null,
    notice: req.flash("notice"),
  })
}


invCont.addInventory = async function (req, res, next) {
  const classification_id = req.body.classification_id
  const inv_make = req.body.inv_make
  const inv_model = req.body.inv_model
  const inv_description = req.body.inv_description
  const inv_image = req.body.inv_image
  const inv_thumbnail = req.body.inv_thumbnail
  const inv_price = req.body.inv_price
  const inv_color = req.body.inv_color
  const inv_miles = req.body.inv_miles
  const inv_year = req.body.inv_year
  const data = await invModel.addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_color, inv_miles, inv_year)
  req.flash("notice", "New vehicle added")
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav: await utilities.getNav(),
    errors: null,
    notice: req.flash("notice"),
  })
}


module.exports = invCont