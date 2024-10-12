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

module.exports = validate