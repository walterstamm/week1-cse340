const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      notice: req.flash("notice"),
      loggedIn: res.locals.loggedin
    })
  }


  async function buildAccount(req, res, next) {
    let nav = await utilities.getNav()
    console.log(res.locals.accountData)
    res.render("account/index", {
      title: "Account",
      nav,
      errors: null,
      notice: req.flash("notice"),
      loggedIn: res.locals.loggedin,
      first_name_user: res.locals.accountData.account_firstname,
      last_name_user: res.locals.accountData.account_lastname,
      account_type: res.locals.accountData.account_type
    })
  }
  


  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    notice: req.flash("notice"),
    loggedIn: res.locals.loggedin
  })
}

  
  /* ****************************************
  *  Process Registration
  * *************************************** */
 async function registerAccount(req, res) {
     let nav = await utilities.getNav()
     const { account_firstname, account_lastname, account_email, account_password } = req.body
     // Hash the password before storing
     let hashedPassword
     try {
       // regular password and cost (salt is generated automatically)
       hashedPassword = await bcrypt.hashSync(account_password, 10)
     } catch (error) {
       req.flash("notice", 'Sorry, there was an error processing the registration.')
       res.status(500).render("account/register", {
         title: "Registration",
      nav,
      errors: null,
      loggedIn: res.locals.loggedin
    })
  }

     const regResult = await accountModel.registerAccount(
         account_firstname,
         account_lastname,
         account_email,
         hashedPassword
        )
        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        notice: req.flash("notice"),
        loggedIn: res.locals.loggedin
      })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
            loggedIn: res.locals.loggedin
      })
    }

  }
    
    /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { email, password } = req.body
  const accountData = await accountModel.getAccountByEmail(email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    email,
    notice: req.flash("notice"),
    loggedIn: res.locals.loggedin
   })
  return
  }
  try {
   if (await bcrypt.compare(password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }



function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/account/login")
}







module.exports = { buildLogin, buildRegister, registerAccount, buildAccount , accountLogin, accountLogout}