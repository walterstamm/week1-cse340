const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")



validate.addClassificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Classification name must contain only letters"),
    ]
}


validate.checkClassificationData = async (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
          errors,
          title: "Add Classification",
          nav,
          notice: null,
        })
        return
      }
      next()
}


validate.addInventoryRules = () => {
    return [
      body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification is required"),
      body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters"),
      body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters"),
      body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters"),
      body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Price must be a number"),
      body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters"),
      body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Miles must be an integer"),
      body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Year must be an integer"),

    ]
}


validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_color, inv_miles, inv_year } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav: await utilities.getNav(),
      classificationList: await utilities.buildClassificationList(classification_id),
      notice: req.flash("notice"),
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_color,
      inv_miles,
      inv_year,
    })
    return
  }
  next()
}


validate.editInventoryRules = () => {
  return [
    body("classification_id")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Classification is required"),
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Make must be at least 3 characters"),
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Model must be at least 3 characters"),
    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters"),
    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .withMessage("Price must be a number"),
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Color must be at least 3 characters"),
    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isInt()
    .withMessage("Miles must be an integer"),
    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isInt()
    .withMessage("Year must be an integer"),
    body("inv_id")
    .trim()
    .escape()
    .notEmpty()
    .isInt()
    .withMessage("ID must be an integer"),

  ]
}


validate.checkEditInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_color, inv_miles, inv_year, inv_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Edit Inventory",
      nav: await utilities.getNav(),
      classificationList: await utilities.buildClassificationList(classification_id),
      notice: req.flash("notice"),
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_color,
      inv_miles,
      inv_year,
      inv_id,
    })
    return
  }
  next()
}


module.exports = validate