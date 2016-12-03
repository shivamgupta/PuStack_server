module.exports = function(router) {

  var lecturesRoute = router.route('/lectures');

  lecturesRoute
  	.get(getAllLectures)
  	.post(addOneLecture);

  var lectureIdRoute = router.route('/lectures/:lectureId')

  lectureIdRoute
  	.get(getOneLecture)
  	.put(updateOneLecture)
  	.delete(deleteOneLecture);

  return router;
}

/**************************************************
 			CONTROLLERS FOR LECTURES(S)
***************************************************/

var mongoose = require('mongoose');
var Lecture = mongoose.model('Lecture');

/**************************************************
 			      READ LECTURES
***************************************************/

var getAllLectures = function(req, res) {

  //console.log('GET the lectures');
  var JSobj = function(myString){
    return eval("("+myString+")");
  };

  //console.log("Oye", req.query.count);

  if (req.query && req.query.count == true.toString())
  {
    Lecture
      .find(JSobj(req.query.where))
      .sort(JSobj(req.query.sort))
      .skip(JSobj(req.query.skip))
      .select(JSobj(req.query.select))
      .limit(JSobj(req.query.limit))
      .count(JSobj(req.query.count))
      .exec(function(err, lectures) {
        //console.log(err);
        //console.log(lectures);
  	var output = lectures;
  	  
        if (err) {
          //console.log("Error finding lectures");
          res
            .status(500)
            .json({
                "message" : "Error finding lectures",
                "data": null
            });
        } else {
          //console.log("Found lectures", lectures.length);
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
    Lecture
      .find(JSobj(req.query.where))
      .sort(JSobj(req.query.sort))
      .skip(JSobj(req.query.skip))
      .select(JSobj(req.query.select))
      .limit(JSobj(req.query.limit))
      .exec(function(err, lectures) {
        //console.log(err);
        //console.log(lectures);
    var output = [lectures];
      
        if (err) {
          //console.log("Error finding lectures");
          res
            .status(500)
            .json({
                "message" : "Error finding lectures",
                "data": null
            });
        } else {
          //console.log("Found lectures", lectures.length);
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
 			 	  CREATE LECTURE
***************************************************/

//helper
var _stringToBoolean = function(string){
    switch(string.toLowerCase().trim()){
        case "Yes": case "True": case "true": case "yes": case "1": return true;
        case "No": case "False": case "false": case "no": case "0": return false;
    }
};

var addOneLecture = function(req, res){
	//console.log('POST new lecture');
	//console.log(req.body);
	
	Lecture
	    .create({
	      name : req.body.name,
	      youtubeURL: req.body.youtubeURL,
        part: req.body.part
	    }, function(err, lecture) {
		      if (err) {
            //console.log("Error creating lecture");
            res
              .status(400)
              .json({
                "message" : "Error creating lecture",
                "data": null
              });
          } else {
            //console.log("Lecture created!", lecture);
            res
              .status(201)
              .json({
                "message" : "Lecture Created",
                "data": lecture
              });
          }
		    }
		);
};

/**************************************************
 			  READ LECTURE WITH GIVEN ID
***************************************************/

var getOneLecture = function(req, res){
	var id = req.params.lectureId;
	//console.log("GET lectureId", id);

	Lecture
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
            //console.log("Error finding lecture");
            response.status = 500;
            response.json1 = {
                                  "message" : "Error finding lecture",
                                  "data": null
                               };
          } else if(!doc) {
            //console.log("lectureId not found in database", id);
            response.status = 404;
            response.json1 = {
                                  "message" : "Lecture not found",
                                  "data": null
                               };
          }
          res
            .status(response.status)
            .json(response.json1);
        });
};

/**************************************************
 			 UPDATE LECTURE WITH GIVEN ID
***************************************************/

var updateOneLecture = function(req, res) {
  var lectureId = req.params.lectureId;

  //console.log('PUT lectureId', lectureId);

  Lecture
    .findById(lectureId)
    .exec(function(err, lecture) {
      if (err) {
        //console.log("Error finding lecture");
        res
          .status(500)
          .json({
                "message" : "Error finding lecture",
                "data": null
              });
          return;
      } else if(!lecture) {
        //console.log("lectureId not found in database", lectureId);
        res
          .status(404)
          .json({
            "message" : "Lecture not found",
            "data": null
          });
          return;
      }

      lecture.name = req.body.name;
      lecture.youtubeURL = req.body.youtubeURL;
      lecture.part = req.body.part;

      lecture
        .save(function(err, lectureUpdated) {
           if(err) {
            res
              .status(500)
              .json({
                "message" : "Lecture not saved",
                "data": null
              });
          } else {
            
            res
              .status(200)
              .header("Content-Type", "application/json")
              .json({
                  "message" : "Lecture updated",
                  "data": lectureUpdated
                });
          }
        });
    });
};

/**************************************************
 			 DELETE LECTURE WITH GIVEN ID
***************************************************/

var deleteOneLecture = function(req, res) {
  var lectureId = req.params.lectureId;

  //console.log('DELETE lectureId', lectureId);

  Lecture
    .findById(lectureId, function(err, lecture) 
    {
      ////console.log(err, Lecture.findById(lecture.id));
      //console.log(err, lecture);
      if (lecture == null) {
        res
          .status(404)
          .json({
                  "message" : "Lecture not found so not deleted",
                  "data": null
                });
      } else 
      {
        //console.log("Lecture deleted, id:", lectureId);
        lecture.remove(function(err, lectureUpdated) {
          if(err) {
            res
              .status(500)
              .json({
                "message" : "Lecture not deleted",
                "data": null
              });
          } else 
          {
            
            res
              .status(200)
              .json({
                  "message" : "Lecture deleted",
                  "data": null
                });
          }
        });
      }
    });
};
