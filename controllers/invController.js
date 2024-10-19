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
    loggedIn: res.locals.loggedin
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
    loggedIn: res.locals.loggedin
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management",
    {
      title: "Vehicle Management",
      nav: await utilities.getNav(),
      errors: null,
      notice: req.flash("notice"),
      classificationSelect,
      loggedIn: res.locals.loggedin
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
    loggedIn: res.locals.loggedin
  })
}



/* ***************************
 *  Add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const classification_name = req.body.classification_name
  const classificationSelect = await utilities.buildClassificationList()

  const data = await invModel.addClassification(classification_name)
  req.flash("notice", "New classification added")
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav: await utilities.getNav(),
    errors: null,
    notice: req.flash("notice"),
    classificationSelect: classificationSelect,
    loggedIn: res.locals.loggedin
  })
}


invCont.buildAddInventory = async function (req, res, next) {
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav: await utilities.getNav(),
    classificationList: await utilities.buildClassificationList(),
    errors: null,
    notice: req.flash("notice"),
    loggedIn: res.locals.loggedin
  })
}


invCont.addInventory = async function (req, res, next) {
  const classificationSelect = await utilities.buildClassificationList()
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
    classificationSelect: classificationSelect,
    loggedIn: res.locals.loggedin
  })
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    notice: req.flash("notice"),
    classificationList: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    loggedIn: res.locals.loggedin
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    loggedIn: res.locals.loggedin
    })
  }
}


/* ***************************
 *  delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    notice: req.flash("notice"),
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    classification_id: itemData.classification_id,
    loggedIn: res.locals.loggedin
  })
}


invCont.deleteInventory = async function (req, res, next) {

  const inv_id = req.body.inv_id
  const data = await invModel.deleteInventory(inv_id)
  const classificationSelect = await utilities.buildClassificationList()

  req.flash("notice", "Vehicle deleted")
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav: await utilities.getNav(),
    errors: null,
    notice: req.flash("notice"),
    classificationSelect: classificationSelect,
    loggedIn: res.locals.loggedin
  })
}




module.exports = invCont