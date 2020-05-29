var async = require('async');
const sql = require("./db.js");

class Categories{

  insertAll(categories, courseId) {
    return new Promise(function(resolve,reject){
      async.forEachOf(categories, function (value, key, call) {
        
        if(value.id === ""){
          const newCategory = {
            name: value.name
          }
          sql.query("INSERT into course_category SET ?", newCategory, function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
              const newCategoryRelation = {
                course_id: courseId,
                category_id: results.insertId
              }
              sql.query("INSERT into course_category_relation SET ?", newCategoryRelation, function (error, results, fields) {
                  if (error) {
                      reject(error)
                  } else {
                      call();
                  }
              });
            }
          });
        } else {
          const newCategoryRelation = {
            course_id: courseId,
            category_id: value.id
          }
          sql.query("INSERT into course_category_relation SET ?", newCategoryRelation, function (error, results, fields) {
              if (error) {
                  reject(error)
              } else {
                  call();
              }
          });
        }
      }, function (err) {
          if (!err) resolve(true);
      });
    });
  }

  deleteRelatedCategories(courseId) {
    return new Promise(function(resolve,reject){
      sql.query("DELETE FROM course_category_relation WHERE course_id = ?", courseId, function(error,results,fields){
        if (error) {
          reject({'error':true, 'result':error});
        } else {
          resolve(true);
        }
      });
    });
  }

}

module.exports = new Categories();