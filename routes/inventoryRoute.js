// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validations")

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));
router.get("/",  utilities.checkLogin, utilities.checkInventoryEditPermission,  utilities.handleErrors(invController.buildManagement));
router.get("/add-classification", utilities.checkLogin, utilities.checkInventoryEditPermission, utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.checkLogin, utilities.checkInventoryEditPermission, validate.addClassificationRules(), validate.checkClassificationData, utilities.handleErrors(invController.addClassification));
router.get("/add-inventory", utilities.checkLogin, utilities.checkInventoryEditPermission, utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", utilities.checkLogin, utilities.checkInventoryEditPermission, validate.addInventoryRules(), validate.checkInventoryData, utilities.handleErrors(invController.addInventory));
router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.checkInventoryEditPermission, utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkInventoryEditPermission, utilities.handleErrors(invController.editInventoryView))
router.post("/update", utilities.checkLogin, utilities.checkInventoryEditPermission, validate.editInventoryRules(), validate.checkEditInventoryData, utilities.handleErrors(invController.updateInventory))
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkInventoryEditPermission, utilities.handleErrors(invController.deleteInventoryView))
router.post("/delete-inventory", utilities.checkLogin, utilities.checkInventoryEditPermission, utilities.handleErrors(invController.deleteInventory))

module.exports = router;