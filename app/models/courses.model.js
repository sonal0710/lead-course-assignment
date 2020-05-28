const sql = require("./db.js");

class Courses{

  getAll() {
    return new Promise(function(resolve,reject){
      sql.query("SELECT courses.*, GROUP_CONCAT(course_category.name) AS categories FROM courses \n\
        JOIN course_category_relation ON course_category_relation.course_id = courses.id \n\
        JOIN course_category on course_category.id = course_category_relation.category_id \n\
        GROUP BY courses.id", function(error,results,fields){
        if (error) {
          reject({'error':true, 'result':error});
        } else {
          resolve(results);
        }
      });
    });
  }

  getCoursesOnBasisOfSorting(sortColumn, sortOrder) {
    let orderOfSort = (sortOrder === 1) ? 'desc' : 'asc';
    return new Promise(function(resolve,reject){
      sql.query("SELECT courses.*, GROUP_CONCAT(course_category.name) AS categories FROM courses \n\
        JOIN course_category_relation ON course_category_relation.course_id = courses.id \n\
        JOIN course_category on course_category.id = course_category_relation.category_id \n\
        GROUP BY courses.id \n\
        ORDER BY courses."+sortColumn+" "+orderOfSort, function(error,results,fields){
        if (error) {
          reject({'error':true, 'result':error});
        } else {
          resolve(results);
        }
      });
    });
  }

  searchCourses(searchStr) {
    return new Promise(function(resolve,reject){
      sql.query("SELECT courses.*, GROUP_CONCAT(course_category.name) AS categories FROM courses \n\
        JOIN course_category_relation ON course_category_relation.course_id = courses.id \n\
        JOIN course_category on course_category.id = course_category_relation.category_id \n\
        WHERE (courses.author like ('%"+searchStr+"%') or courses.name like ('%"+searchStr+"%'))\n\
        GROUP BY courses.id", function(error,results,fields){
        if (error) {
          reject({'error':true, 'result':error});
        } else {
          resolve(results);
        }
      });
    });
  }

  create(newCourse) {
    return new Promise(function(resolve,reject){
      sql.query("INSERT INTO courses SET ?", newCourse, function(error,results,fields){
        if (error) {
          reject({'error':true, 'result':error});
        } else {
          resolve({ id: results.insertId, ...newCourse });
        }
      });
    });
  }

  delete(courseId) {
    return new Promise(function(resolve,reject){
      sql.query("DELETE FROM courses WHERE id = ?", courseId, function(error,results,fields){
        if (error) {
          reject({'error':true, 'result':error});
        } else {
          resolve({'error':false, 'result': 'Course Deleted Successfully'});
        }
      });
    });
  }
}

module.exports = new Courses();