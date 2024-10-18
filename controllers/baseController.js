const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav, loggedIn: res.locals.loggedin, notice: req.flash("notice")})
}

module.exports = baseController