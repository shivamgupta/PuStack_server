var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    unique: true
  },
  password : {
    type : String,
    required : true
  },
  coursesEnrolled : [String],
  lecturesViewed : [String],
  dateJoined : {
    type : Date,
    "default" : Date.now
  },
  currentStandard : {
    type : Number,
    "default" : 10,
    required : true
  }
});

mongoose.model('User', usersSchema);