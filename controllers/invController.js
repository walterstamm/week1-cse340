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

module.exports = invCont