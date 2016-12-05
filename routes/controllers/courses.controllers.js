module.exports = function(router) {

  var coursesRoute = router.route('/courses');

  coursesRoute
  	.get(getAllCourses)
  	.post(addOneCourse);

  var courseIdRoute = router.route('/courses/:courseId')

  courseIdRoute
  	.get(getOneCourse)
  	.put(updateOneCourse)
  	.delete(deleteOneCourse);

  return router;
}

/**************************************************
 			CONTROLLERS FOR COURSE(S)
***************************************************/

var mongoose = require('mongoose');
var Course = mongoose.model('Course');

/**************************************************
 			      READ COURSES
***************************************************/

var getAllCourses = function(req, res) {

  //console.log('GET the courses');
  var JSobj = function(myString){
    return eval("("+myString+")");
  };

  //console.log("Oye", req.query.count);

  if (req.query && req.query.count == true.toString())
  {
    Course
      .find(JSobj(req.query.where))
      .sort(JSobj(req.query.sort))
      .skip(JSobj(req.query.skip))
      .select(JSobj(req.query.select))
      .limit(JSobj(req.query.limit))
      .count(JSobj(req.query.count))
      .exec(function(err, courses) {
        //console.log(err);
        //console.log(courses);
  	var output = courses;
  	  
        if (err) {
          //console.log("Error finding courses");
          res
            .status(500)
            .json({
                "message" : "Error finding courses",
                "data": null
            });
        } else {
          //console.log("Found courses", courses.length);
          res
            .status(200)  
            .json({
                "message" : "OK",
                "data": output
            });
        }
      });
  }
  else
  {
    Course
      .find(JSobj(req.query.where))
      .sort(JSobj(req.query.sort))
      .skip(JSobj(req.query.skip))
      .select(JSobj(req.query.select))
      .limit(JSobj(req.query.limit))
      .exec(function(err, courses) {
        //console.log(err);
        //console.log(courses);
    var output = [courses];
      
        if (err) {
          //console.log("Error finding courses");
          res
            .status(500)
            .json({
                "message" : "Error finding courses",
                "data": null
            });
        } else {
          //console.log("Found courses", courses.length);
          res
            .status(200)  
            .json({
                "message" : "OK",
                "data": output
            });
        }
      });
  }

};

/**************************************************
 			 	  CREATE COURSE
***************************************************/

//helper
var _splitArray = function(input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
};

var addOneCourse = function(req, res){
	//console.log('POST new course');
	//console.log(req.body);
	
	Course
	    .create({
	      name : req.body.name,
	      description: req.body.description,
	      chapters: _splitArray(req.body.chapters),
	      courseStandard: req.body.courseStandard,
        imageURL: req.body.imageURL,
        author: req.body.author
	    }, function(err, course) {
		      if (err) {
            //console.log("Error creating course");
            res
              .status(400)
              .json({
                "message" : "Error creating course",
                "data": null
              });
          } else {
            //console.log("Course created!", course);
            res
              .status(201)
              .json({
                "message" : "Course Created",
                "data": course
              });
          }
		    }
		);
};

/**************************************************
 			  READ COURSE WITH GIVEN ID
***************************************************/

var getOneCourse = function(req, res){
	var id = req.params.courseId;
	//console.log("GET courseId", id);

	Course
		.findById(id)
		    .exec(function(err, doc) {
		      var response = {
            status : 200,
            json1:{
              "message": "OK",
              "data" : doc
            }
          };
          if (err) {
            //console.log("Error finding course");
            response.status = 500;
            response.json1 = {
                                  "message" : "Error finding course",
                                  "data": null
                               };
          } else if(!doc) {
            //console.log("courseId not found in database", id);
            response.status = 404;
            response.json1 = {
                                  "message" : "Course not found",
                                  "data": null
                               };
          }
          res
            .status(response.status)
            .json(response.json1);
        });
};

/**************************************************
 			 UPDATE COURSE WITH GIVEN ID
***************************************************/

var updateOneCourse = function(req, res) {
  var courseId = req.params.courseId;

  //console.log('PUT courseId', courseId);

  Course
    .findById(courseId)
    .exec(function(err, course) {
      if (err) {
        //console.log("Error finding course");
        res
          .status(500)
          .json({
                "message" : "Error finding course",
                "data": null
              });
          return;
      } else if(!course) {
        //console.log("courseId not found in database", courseId);
        res
          .status(404)
          .json({
            "message" : "Course not found",
            "data": null
          });
          return;
      }

      course.name = req.body.name;
      course.description = req.body.description;
      course.chapters = _splitArray(req.body.chapters);
      course.courseStandard = req.body.courseStandard;
      course.imageURL = req.body.imageURL;
      course.author = req.body.author;

      course
        .save(function(err, courseUpdated) {
           if(err) {
            res
              .status(500)
              .json({
                "message" : "Course not saved",
                "data": null
              });
          } else {
            
            res
              .status(200)
              .header("Content-Type", "application/json")
              .json({
                  "message" : "Course updated",
                  "data": courseUpdated
                });
          }
        });
    });
};

/**************************************************
 			 DELETE TASK WITH GIVEN ID
***************************************************/

var deleteOneCourse = function(req, res) {
  var courseId = req.params.courseId;

  //console.log('DELETE courseId', courseId);

  Course
    .findById(courseId, function(err, course) 
    {
      ////console.log(err, Course.findById(course.id));
      //console.log(err, course);
      if (course == null) {
        res
          .status(404)
          .json({
                  "message" : "Course not found so not deleted",
                  "data": null
                });
      } else 
      {
        //console.log("Course deleted, id:", courseId);
        course.remove(function(err, courseUpdated) {
          if(err) {
            res
              .status(500)
              .json({
                "message" : "Course not deleted",
                "data": null
              });
          } else 
          {
            
            res
              .status(200)
              .json({
                  "message" : "Course deleted",
                  "data": null
                });
          }
        });
      }
    });
};
