const sql = require("./db.js");
const Categories = require("./categories.model.js");

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

  create(newCourse, categories) {
    return new Promise(function(resolve,reject){
      sql.query("INSERT INTO courses SET ?", newCourse, function(error,results,fields){
        if (error) {
          reject({'error':true, 'result':error});
        } else {
          Categories.insertAll(categories, results.insertId).then( function(success){
            resolve({ id: results.insertId, ...newCourse });
          }).catch( function(error){
              reject(error)
          })
        }
      });
    });
  }

  delete(courseId) {
    return new Promise(function(resolve,reject){
      Categories.deleteRelatedCategories(courseId).then( function(success){
        sql.query("DELETE FROM courses WHERE id = ?", courseId, function(error,results,fields){
          if (error) {
            reject({'error':true, 'result':error});
          } else {
            resolve({'error':false, 'result': 'Course Deleted Successfully'});
          }
        });
      }).catch( function(error){
          reject(error)
      })
    });
  }

  update(courseId, newCourse, categories) {
    return new Promise(function(resolve,reject){
      sql.query("UPDATE courses SET name = ?, author = ?, popularity = ?, difficulty_level = ?, updated_by = ?, updated_date = ? WHERE id = ?",
      [newCourse.name, newCourse.author, newCourse.popularity, newCourse.difficulty_level, newCourse.updated_by, newCourse.updated_date, courseId],
       function(error,results,fields){
        if (error) {
          reject({'error':true, 'error':error});
        } else {
          Categories.deleteRelatedCategories(courseId).then( function(success){
            Categories.insertAll(categories, courseId).then( function(success){
              resolve({ error: false, 'message': 'Updated Successfully' });
            })
          }).catch( function(error){
            reject(error);
          })
        }
      });
    });
  }

  searchCourses(searchStr, categoriesList) {
    let $where = ""
    if(searchStr !== ""){
      $where = "courses.author like ('%"+searchStr+"%') or courses.name like ('%"+searchStr+"%')"
    }
    if(searchStr !== "" && categoriesList.length){
      $where = $where + " AND ";
    }
    if (categoriesList.length) {
      if(searchStr == ""){
        $where = " course_category_relation.category_id IN ("+categoriesList.toString()+")"
      } else {
        $where = $where + " course_category_relation.category_id IN ("+categoriesList.toString()+") ";
      }
    }
    return new Promise(function(resolve,reject){
      sql.query("SELECT courses.*, GROUP_CONCAT(course_category.name) AS categories FROM courses \n\
        JOIN course_category_relation ON course_category_relation.course_id = courses.id \n\
        JOIN course_category on course_category.id = course_category_relation.category_id \n\
        WHERE ("+ $where +")\n\
        GROUP BY courses.id", function(error,results,fields){
        if (error) {
          reject({'error':true, 'result':error});
        } else {
          resolve(results);
        }
      });
    });
  }

}

module.exports = new Courses();