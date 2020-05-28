const express = require("express");
const bodyParser = require("body-parser");
const session  = require('express-session');
const passport = require("passport");

const app = express();

require('./app/config/passport')(passport);

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Lead Course application." });
});

app.get("/failureRedirect", (req, res) => {
  res.json({ message: "Wrong Credentials, Try Again" });
});


app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session());

require("./app/routes/courses.routes.js")(app, passport);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
