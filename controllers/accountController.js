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
  res.redirect("/")
}

async function updateAccountView(req, res) {
  let nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    notice: req.flash("notice"),
    loggedIn: res.locals.loggedin,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
    account_id: res.locals.accountData.account_id,
    loggedIn: res.locals.loggedin

  })
}
  

async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  const nav = await utilities.getNav()
  if (updateResult) {

    res.locals.accountData.account_firstname = account_firstname
    res.locals.accountData.account_lastname = account_lastname
    res.locals.accountData.account_email = account_email
    

    const updatedAccountData = { ...res.locals.accountData } 
    delete updatedAccountData.iat
    delete updatedAccountData.exp
    const accessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })

    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    req.flash("notice", "Account updated successfully")
    res.status(201).render("account/index", {
      title: "Account",
      nav,
      errors: null,
      notice: req.flash("notice"),
      loggedIn: res.locals.loggedin,
      first_name_user: account_firstname,
      last_name_user: account_lastname,
      account_type: res.locals.accountData.account_type

    })
  } else {
    req.flash("notice", "Account update failed")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      notice: req.flash("notice"),
      loggedIn: res.locals.loggedin,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
      account_id: res.locals.accountData.account_id
    })
  }
}


async function changePassword(req, res) {
  const { account_password, account_id } = req.body
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
        loggedIn: res.locals.loggedin,
        notice: req.flash("notice"),
        account_firstname: res.locals.accountData.account_firstname,
        account_lastname: res.locals.accountData.account_lastname,
        account_email: res.locals.accountData.account_email,
        account_id: res.locals.accountData.account_id
    })
  }
  const changePasswordResult = await accountModel.changePassword(hashedPassword, account_id)
  if (changePasswordResult) {
    req.flash("notice", "Password updated successfully")
    res.status(201).redirect("/account/")
  } else {
    req.flash("notice", "Password update failed")
    res.status(501).redirect("/account/update")
  }
}



async function buildUserList(req, res) {
  let nav = await utilities.getNav()
  const accountList = await accountModel.getAccountList()
  const userList = utilities.buildUserList(accountList)
  res.render("account/user-list", {
    title: "User List",
    nav,
    errors: null,
    notice: req.flash("notice"),
    loggedIn: res.locals.loggedin,
    userList: userList
  })
}


async function changeRoleView(req, res) {
  let nav = await utilities.getNav()
  const account_id = req.params.id
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/change-role", {
    title: "Change Role",
    nav,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
    account_id: account_id
  })
}

async function changeRole(req, res) {
  const { account_type, account_id } = req.body
  const changeRoleResult = await accountModel.changeRole(account_type, account_id)
  const accountList = await accountModel.getAccountList()
  const userList = utilities.buildUserList(accountList)
  const nav = await utilities.getNav()
  if (changeRoleResult) {
    const updatedAccountData = changeRoleResult.rows[0]
    delete updatedAccountData.iat
    delete updatedAccountData.exp
    const accessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    req.flash("notice", "Role updated successfully")
    res.status(201).render("account/user-list", {
      title: "User List",
      nav,
      errors: null,
      notice: req.flash("notice"),
      loggedIn: res.locals.loggedin,
      userList: userList
    })
  } else {
    req.flash("notice", "Role update failed")
    res.status(501).render("account/change-role", {
      title: "Change Role",
      nav,
      errors: null,
      notice: req.flash("notice"),
      loggedIn: res.locals.loggedin,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
      account_type: res.locals.accountData.account_type,
      account_id: res.locals.accountData.account_id
    })
  }
}









module.exports = { buildLogin, buildRegister, registerAccount, buildAccount , accountLogin, accountLogout, updateAccountView, updateAccount, changePassword, buildUserList, changeRoleView, changeRole}