const passport = require("passport");

module.exports = app => {
  const courses = require("../controllers/courses.controller.js");

  // Retrieve all Courses
  app.get("/courses", courses.findAllCourses);

  // Sorting a single course field
  app.get("/courses/sort/:sortColumn", courses.sortCourses);

  // Sorting a single course field
  app.get("/courses/search/:searchStr", courses.searchCourses);

  // Create a new Course
  app.post("/courses", isLoggedIn, courses.create);

  // Create a new Customer
  app.delete("/courses/:courseId", isLoggedIn, courses.delete);

  // Create a new Admin
  app.post('/signup', passport.authenticate('local-signup', {failureRedirect: '/failureRedirect' }), function(req, res) {
    res.status(200).send({message:'Login Successfully', data: res})
  });

  // Admin Login
  app.post('/login', passport.authenticate('local-login', {failureRedirect: '/failureRedirect' }), function(req, res) {
    res.status(200).send({message: 'Login Successfully'})
  });

  // Function to check user is logged in or not
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
      console.log("Authenticated user")
      return next();

    }
    res.send('Unauthorised User');
  }
};
