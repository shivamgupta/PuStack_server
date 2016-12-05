module.exports = function(router) {

  var chaptersRoute = router.route('/chapters');

  chaptersRoute
  	.get(getAllChapters)
  	.post(addOneChapter);

  var chapterIdRoute = router.route('/chapters/:chapterId')

  chapterIdRoute
  	.get(getOneChapter)
  	.put(updateOneChapter)
  	.delete(deleteOneChapter);

  return router;
}

/**************************************************
 			CONTROLLERS FOR CHAPTER(S)
***************************************************/

var mongoose = require('mongoose');
var Chapter = mongoose.model('Chapter');

/**************************************************
 			      READ CHAPTERS
***************************************************/

var getAllChapters = function(req, res) {

  //console.log('GET the chapters');
  var JSobj = function(myString){
    return eval("("+myString+")");
  };

  //console.log("Oye", req.query.count);

  if (req.query && req.query.count == true.toString())
  {
    Chapter
      .find(JSobj(req.query.where))
      .sort(JSobj(req.query.sort))
      .skip(JSobj(req.query.skip))
      .select(JSobj(req.query.select))
      .limit(JSobj(req.query.limit))
      .count(JSobj(req.query.count))
      .exec(function(err, chapters) {
        //console.log(err);
        //console.log(chapters);
  	var output = chapters;
  	  
        if (err) {
          //console.log("Error finding chapters");
          res
            .status(500)
            .json({
                "message" : "Error finding chapters",
                "data": null
            });
        } else {
          //console.log("Found chapters", chapters.length);
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
    Chapter
      .find(JSobj(req.query.where))
      .sort(JSobj(req.query.sort))
      .skip(JSobj(req.query.skip))
      .select(JSobj(req.query.select))
      .limit(JSobj(req.query.limit))
      .exec(function(err, chapters) {
        //console.log(err);
        //console.log(chapters);
    var output = [chapters];
      
        if (err) {
          //console.log("Error finding chapters");
          res
            .status(500)
            .json({
                "message" : "Error finding chapters",
                "data": null
            });
        } else {
          //console.log("Found chapters", chapters.length);
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
 			 	  CREATE CHAPTER
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

var addOneChapter = function(req, res){
	//console.log('POST new chapter');
	//console.log(req.body);
	
	Chapter
	    .create({
	      name : req.body.name,
	      description: req.body.description,
	      lectures: _splitArray(req.body.lectures),
        imageURL: req.body.imageURL,
        author: req.body.author
	    }, function(err, chapter) {
		      if (err) {
            //console.log("Error creating chapter");
            res
              .status(400)
              .json({
                "message" : "Error creating chapter",
                "data": null
              });
          } else {
            //console.log("Chapter created!", chapter);
            res
              .status(201)
              .json({
                "message" : "Chapter Created",
                "data": chapter
              });
          }
		    }
		);
};

/**************************************************
 			  READ CHAPTER WITH GIVEN ID
***************************************************/

var getOneChapter = function(req, res){
	var id = req.params.chapterId;
	//console.log("GET chapterId", id);

	Chapter
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
            //console.log("Error finding chapter");
            response.status = 500;
            response.json1 = {
                                  "message" : "Error finding chapter",
                                  "data": null
                               };
          } else if(!doc) {
            //console.log("chapterId not found in database", id);
            response.status = 404;
            response.json1 = {
                                  "message" : "Chapter not found",
                                  "data": null
                               };
          }
          res
            .status(response.status)
            .json(response.json1);
        });
};

/**************************************************
 			 UPDATE CHAPTER WITH GIVEN ID
***************************************************/

var updateOneChapter = function(req, res) {
  var chapterId = req.params.chapterId;

  //console.log('PUT chapterId', chapterId);

  Chapter
    .findById(chapterId)
    .exec(function(err, chapter) {
      if (err) {
        //console.log("Error finding chapter");
        res
          .status(500)
          .json({
                "message" : "Error finding chapter",
                "data": null
              });
          return;
      } else if(!chapter) {
        //console.log("chapterId not found in database", chapterId);
        res
          .status(404)
          .json({
            "message" : "Chapter not found",
            "data": null
          });
          return;
      }

      chapter.name = req.body.name;
      chapter.description = req.body.description;
      chapter.lectures = _splitArray(req.body.lectures);
      chapter.imageURL = req.body.imageURL;
      chapter.author = req.body.author;

      chapter
        .save(function(err, chapterUpdated) {
           if(err) {
            res
              .status(500)
              .json({
                "message" : "Chapter not saved",
                "data": null
              });
          } else {
            
            res
              .status(200)
              .header("Content-Type", "application/json")
              .json({
                  "message" : "Chapter updated",
                  "data": chapterUpdated
                });
          }
        });
    });
};

/**************************************************
 			 DELETE CHAPTER WITH GIVEN ID
***************************************************/

var deleteOneChapter = function(req, res) {
  var chapterId = req.params.chapterId;

  //console.log('DELETE chapterId', chapterId);

  Chapter
    .findById(chapterId, function(err, chapter) 
    {
      ////console.log(err, Chapter.findById(chapter.id));
      //console.log(err, chapter);
      if (chapter == null) {
        res
          .status(404)
          .json({
                  "message" : "Chapter not found so not deleted",
                  "data": null
                });
      } else 
      {
        //console.log("Chapter deleted, id:", chapterId);
        chapter.remove(function(err, chapterUpdated) {
          if(err) {
            res
              .status(500)
              .json({
                "message" : "Chapter not deleted",
                "data": null
              });
          } else 
          {
            
            res
              .status(200)
              .json({
                  "message" : "Chapter deleted",
                  "data": null
                });
          }
        });
      }
    });
};
