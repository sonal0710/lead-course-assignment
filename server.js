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

require("./app/routes/courses.routes.js")(app, passport);
require("./app/routes/admin.routes.js")(app, passport);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
