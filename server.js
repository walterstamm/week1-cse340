/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const express = require("express")
const cookieParser = require("cookie-parser")
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))




app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
/* ***********************
* Routes
*************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(static)
app.use(cookieParser())
app.use(utilities.checkJWTToken)
//index route 
app.get("/", utilities.handleErrors(baseController.buildHome))
app.get("/",baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
// route to force a 500 error
app.get('/get-error-500', (req, res, next) => {
  throw new Error('This is a forced 500 error');
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
// Middleware to handle errors


app.use(async (err, req, res, next) => {
  console.error(err.stack);
  const nav = await utilities.getNav(); 
  const status = err.status || 500;
  const message = (status === 500) ? 'Oh no! There was a crash. We are working on it.' : err.message;
  res.status(status).render("errors/error", {
    title: `Error ${status}`,
    message,
    nav
  });
});

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
  console.log(`http://${host}:${port}`)
})

