require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var app = express();
const Grid = require('gridfs-stream');
const fs = require('fs');
var indexRouter = require('./routes/index');
var formRouter = require('./routes/form')
const mongoose = require('mongoose');
const MongoClient = require('mongodb')
const db = require('./helper/db');
const folder = require('./models/folder');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');


app.use(cors());

// view engine setup
app.use(express.static(path.join(__dirname, 'dist')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'folder')));

app.use('/', indexRouter);
app.use('/', formRouter)

let gfs;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Berhasil Tersambung');
  gfs = Grid(db, mongoose.mongo);
  gfs.collection('folder.file.files'); 
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'folder');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+ file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('File harus berupa PDF'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


// Post File
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(404).send('Tidak Ada File Yang Di Upload');
    }

    const { originalname, buffer, mimetype } = req.file;
    const newFile = new folder({
      name: originalname,
      data: buffer,
      contentType: mimetype
    });

    const bucket = new GridFSBucket(db, { bucketName: 'folder.file' });
  
    const writeStaream = fs.createWriteStream( req.file.path)
    const readStream = fs.createReadStream(req.file.path);
    const uploadStream = bucket.openUploadStream(req.file.originalname);
    readStream.pipe(uploadStream)
    
    readStream.on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    // uploadStream.on('error', (error) => {
    //   console.error(error);
    //   res.status(500).json({ error: 'Internal Server Error' });
    // });

    uploadStream.on('finish', () => {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err);
        }
      });
      res.send('File Berhasil Di Upload');

      
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while uploading the file' });
  }
});


app.get('/get', async (req, res) => {
  try {

    const bucket = new GridFSBucket(db, { bucketName: 'folder.file' });

    const files = await bucket.find().toArray();

    // Check if data is found
    if (files.length > 0) {
      // Data found
      res.send(files);
    } else {
      // Data not found
      res.send('No data found');
    }
  } catch (error) { 
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/upload/:filename', (req, res) => {
  const bucket = new GridFSBucket(db, {
    bucketName: 'folder.file',
  });

  bucket.find({ filename: req.params.filename }).toArray((err, files) => {
    if (err) {
      console.log(err);
      return res.send({status: "error"})
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        error: 'File Not Found',
      });
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(file._id);

    // Set appropriate headers for file download
    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);

    downloadStream.pipe(res);
  });
});

module.exports = app;
