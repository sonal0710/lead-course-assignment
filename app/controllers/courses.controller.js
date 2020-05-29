const Courses = require("../models/courses.model.js");
var dateTime = require('node-datetime');

exports.findAllCourses = (req, res) => {
  Courses.getAll().then( function(success){
      return res.send(success);
  }).catch( function(error){
      return res.send(error);
  });
};

exports.sortCourses = (req, res) => {
  let sortColumn = req.params.sortColumn;
  let sortOrder = req.body.order;
  Courses.getCoursesOnBasisOfSorting(sortColumn, sortOrder).then( function(success){
      return res.send(success);
  }).catch( function(error){
      return res.send(error);
  });
};

exports.searchCourses = (req, res) => {
  let searchStr = req.params.searchStr;
  let categoriesList = req.body.categories;
  Courses.searchCourses(searchStr, categoriesList).then( function(success){
      return res.send(success);
  }).catch( function(error){
      return res.send(error);
  });
}

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Course
  const course = {
    author: req.body.author,
    name: req.body.name,
    popularity: req.body.popularity,
    difficulty_level: req.body.difficulty_level,
    updated_by: req.user.id,
    created_date: dateTime.create().format('Y-m-d H:M:S'),
    updated_date: dateTime.create().format('Y-m-d H:M:S')
  };
  
  let categories = req.body.categories;

  Courses.create(course, categories).then( function(success){
      return res.send(success);
  }).catch( function(error){
      return res.send(error);
  });
};

exports.delete = (req, res) => {
  let courseId = req.params.courseId;
  Courses.delete(courseId).then( function(success){
      return res.send(success);
  }).catch( function(error){
      return res.send(error);
  });
};

exports.update = (req, res) => {
  let courseId = req.params.courseId;
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Course
  const course = {
    author: req.body.author,
    name: req.body.name,
    popularity: req.body.popularity,
    difficulty_level: req.body.difficulty_level,
    updated_by: req.user.id,
    updated_date: dateTime.create().format('Y-m-d H:M:S')
  };
  
  let categories = req.body.categories;

  Courses.update(courseId, course, categories).then( function(success){
      return res.send(success);
  }).catch( function(error){
      return res.send(error);
  });
  
};