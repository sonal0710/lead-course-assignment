const passport = require("passport");

module.exports = app => {
  const courses = require("../controllers/courses.controller.js");

  // Retrieve all Courses
  app.get("/courses", courses.findAllCourses);

  // Sorting a single course field
  app.get("/courses/sort/:sortColumn", courses.sortCourses);

  // Create a new Course
  app.post("/courses", passport.authenticate('jwt', { session : false }), courses.create);

  // Delete Course
  app.delete("/courses/:courseId", passport.authenticate('jwt', { session : false }), courses.delete);

  // Update a new Course
  app.put("/courses/:courseId", passport.authenticate('jwt', { session : false }), courses.update);

  // Sorting a single course field
  app.get("/courses/search/:searchStr", courses.searchCourses);

};
