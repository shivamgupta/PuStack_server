var mongoose = require('mongoose');

var coursesSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  description:{
  	type : String
  },
  lectures: [String],
  courseStandard : {
    type : Number
  }
});

mongoose.model('Course', coursesSchema);