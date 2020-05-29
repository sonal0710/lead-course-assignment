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
  app.post("/courses", passport.authenticate('jwt', { session : false }), courses.create);

  // Create a new Customer
  app.delete("/courses/:courseId", passport.authenticate('jwt', { session : false }), courses.delete);

};
