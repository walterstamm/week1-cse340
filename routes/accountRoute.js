// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
router.get("/logout", utilities.handleErrors(accountController.accountLogout))
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.updateAccountView))
router.post("/update", regValidate.updateAccountRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))
router.post("/change-password", regValidate.changePasswordRules(), regValidate.checkChangePasswordData, utilities.handleErrors(accountController.changePassword))

module.exports = router