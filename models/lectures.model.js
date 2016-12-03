var mongoose = require('mongoose');

var lecturesSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  part : {
    type: Number
  },
  youtubeURL:{
  	type : String,
    required : true
  }
});

mongoose.model('Lecture', lecturesSchema);