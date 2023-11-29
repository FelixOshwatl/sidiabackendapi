const { ObjectID } = require("bson");
const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const folderSchema  = new mongoose.Schema({
  // _id:{},
  length:{type:Number, require:true},
  chunkSize:{type:Number, require:true},
  uploadDate:{type:String, require:true},
  foldername:{type:String, require:true},
  contentType:{type:String, require:true},
  aliases:{type:String , require:true},
  metadata : {type:Schema.Types.Mixed, require:true},
  children: []
});


module.exports = mongoose.model('Folder',folderSchema)