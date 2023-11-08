const mongoose = require ("mongoose");

const urlConf = 'mongodb://127.0.0.1:27017/sidia';

mongoose.connect(urlConf) 
module.exports = mongoose.connection  