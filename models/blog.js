var mongoose = require("mongoose");

// SCHEMA SETUP
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now()}
});   

// model
module.exports = mongoose.model("Blog", blogSchema); 