var mongoose = require('mongoose');

var chaptersSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  description:{
  	type : String
  },
  lectures: [String],
  imageURL: String,
  author: String
});

mongoose.model('Chapter', chaptersSchema);
