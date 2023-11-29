const { ObjectID } = require("bson");
const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required :true
  },
  data: {
    type: Buffer,
    required :true
  },
  contentType: {
    type: String,
    required :true
  },
  uploadDate:{
    type :Date,
    required:true
  }
});

  module.exports = mongoose.model('File', FileSchema);