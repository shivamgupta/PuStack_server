var mongoose = require('mongoose');

var coursesSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  description:{
  	type : String
  },
  chapters: [String],
  courseStandard : {
    type : Number
  },
  imageURL: String,
  author: String
});

mongoose.model('Course', coursesSchema);
