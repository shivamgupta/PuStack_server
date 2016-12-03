module.exports = function(router) {

  var usersRoute = router.route('/users');

  usersRoute
  	.get(getAllUsers)
  	.post(addOneUser);

  var userIdRoute = router.route('/users/:userId')

  userIdRoute
  	.get(getOneUser)
  	.put(updateOneUser)
  	.delete(deleteOneUser);

  return router;
}

/**************************************************
 			CONTROLLERS FOR USER(S)
***************************************************/

var mongoose = require('mongoose');
var User = mongoose.model('User');

/**************************************************
 			      READ USERS
***************************************************/

var getAllUsers = function(req, res) {

  //console.log('GET the users');
  var JSobj = function(myString){
      return eval("("+myString+")");
  };

  ////console.log("count", req.query.count);

  if (req.query && req.query.count == true.toString())
  {
      User
      .find(JSobj(req.query.where))
      .sort(JSobj(req.query.sort))
      .skip(JSobj(req.query.skip))
      .select(JSobj(req.query.select))
      .limit(JSobj(req.query.limit))
      .count(JSobj(req.query.count))
      .exec(function(err, users) {
        ////console.log(err);
        ////console.log(users);
      
        if (err) {
          ////console.log("Error finding users");
          res
            .status(500)
            .json({
                "message" : "Error finding users",
                "data": null
            });
        } else {
          ////console.log("Found users", users.length);
          res
            .status(200)  
            .json({
                "message" : "OK",
                "data": users
            });
        }
      });
  }
  else
  {
    User
      .find(JSobj(req.query.where))
      .sort(JSobj(req.query.sort))
      .skip(JSobj(req.query.skip))
      .select(JSobj(req.query.select))
      .limit(JSobj(req.query.limit))
      .exec(function(err, users) {
        ////console.log(err);
        ////console.log(users);
  	var output = [users];
  	  
        if (err) {
          ////console.log("Error finding users");
          res
            .status(500)
            .json({
                "message" : "Error finding users",
                "data": null
            });
        } else {
          ////console.log("Found users", users.length);
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
 			 	  CREATE USER
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

var addOneUser = function(req, res){
	//console.log('POST new user');
	//console.log(req.body);
	
	User
	    .create({
	      name : req.body.name,
	      email : req.body.email,
        password : req.body.password,
        coursesEnrolled : _splitArray(req.body.coursesEnrolled),
        lecturesViewed : _splitArray(req.body.lecturesViewed),
        currentStandard: req.body.currentStandard
	    }, function(err, user) {
		      if (err) {
		        //console.log("Error creating user");
		        res
		          .status(400)
		          .json({
                "message" : "Error creating user",
                "data": null
              });
		      } else {
		        //console.log("User created!", user);
		        res
		          .status(201)
		          .json({
                "message" : "User Created",
                "data": user
              });
		      }
		    }
		);
};

/**************************************************
 			  READ USER WITH GIVEN ID
***************************************************/

var getOneUser = function(req, res){
	var id = req.params.userId;
	//console.log("GET userId", id);

	User
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
		        //console.log("Error finding user");
		        response.status = 500;
		        response.json1 = {
                                  "message" : "Error finding user",
                                  "data": null
                               };
		      } else if(!doc) {
		        //console.log("UserId not found in database", id);
		        response.status = 404;
		        response.json1 = {
                                  "message" : "User not found",
                                  "data": null
                               };
		      }
		      res
		        .status(response.status)
		        .json(response.json1);
		    });
};

/**************************************************
 			 UPDATE USER WITH GIVEN ID
***************************************************/

var updateOneUser = function(req, res) {
  var userId = req.params.userId;

  //console.log('PUT userId', userId);

  User
    .findById(userId)
    .exec(function(err, user) {
      if (err) {
        //console.log("Error finding user");
        res
          .status(500)
          .json({
                "message" : "Error finding user",
                "data": null
              });
          return;
      } else if(!user) {
        //console.log("userId not found in database", userId);
        res
          .status(404)
          .json({
            "message" : "User not found",
            "data": null
          });
          return;
      }

      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      user.coursesEnrolled = _splitArray(req.body.coursesEnrolled);
      user.lecturesViewed  = _splitArray(req.body.lecturesViewed);
      user.currentStandard = req.body.currentStandard;


      user
        .save(function(err, userUpdated) {
          if(err) {
            res
              .status(500)
              .json({
                "message" : "User not saved",
                "data": null
              });
          } else {
            
            res
              .status(200)
              .header("Content-Type", "application/json")
              .json({
                  "message" : "User updated",
                  "data": userUpdated
                });
          }
        });
    });
};

/**************************************************
 			 DELETE USER WITH GIVEN ID
***************************************************/

var deleteOneUser = function(req, res) {
  var userId = req.params.userId;

  //console.log('DELETE userId', userId);

  User
    .findById(userId, function(err, user) 
    {
      ////console.log(err, User.findById(user.id));
      //console.log(err, user);
      if (user == null) {
        res
          .status(404)
          .json({
                  "message" : "User not found so not deleted",
                  "data": null
                });
      } else 
      {
        //console.log("User deleted, id:", userId);
        user.remove(function(err, userUpdated) {
          if(err) {
            res
              .status(500)
              .json({
                "message" : "User not deleted",
                "data": null
              });
          } else 
          {
            
            res
              .status(200)
              .json({
                  "message" : "User deleted",
                  "data": null
                });
          }
        });
      }
    });
};
