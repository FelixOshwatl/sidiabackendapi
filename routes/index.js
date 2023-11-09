require('dotenv').config()
const path = require ('path')
const fs = require('fs')
const multer = require('multer')
const express = require('express');
const router = express.Router();
const File = require('../models/file'); // Impor model file yang sudah dibuat
const upload = multer({ dest: 'uploads/', limits: { fieldSize: 25 * 1024 * 1024 } });
require('../helper/db')

const Folders = require('../models/folder');

// Get All Folder
router.get('/folder', async (req, res) => {
    try {
        const folders = await Folders.find();
        res.status(200).json(folders);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' })


        
    }
});

// Get a Single Folder by ID
router.get('/folder/:id', async (req, res) => {
    try {
        const folder = await Folders.findById(req.params.id);
        if (!folder) {
            return res.status(404).json({ error: 'Folder Not Found' })
        }
        res.status(200).json(folder);
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

// insert to Folder
router.post('/folder', async (req, res) => {
    try {
        let { body } = req
        console.log(body)
        const folder = await Folders.create(body)
        res.status(200).json(folder);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Update Folder by ID
router.post('/folder/:id', async (req, res) => {
    try {
        let { body, params } = req
        console.log(body)
        const folder = await Folders.findByIdAndUpdate(params.id, body)
        if (!folder) {
            return res.status(400).json({ msg: 'Data Tidak Ditemukan' });
        }
        res.status(200).json({ msg: 'Data Berhasil Diubah' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Delete Folder By ID
router.delete('/folder/:id', async (req, res) => {
    try {
        let { params } = req
        console.log(params);
        const folder = await Folders.findByIdAndDelete(params.id)
        if (!folder) {
            return res.status(400).json({ msg: 'Data Tidak Ditemukan' });
        }
        res.status(200).json({ msg: 'Data Berhasil Di Hapus' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Upload File
router.post('/uploads',upload.single('file'),async(req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { originalname, buffer, mimetype } = req.file;
    const files = new File({
      name:originalname,
      data:buffer,
      contentType:mimetype
      // contentType,

    });
    await file.save();
    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while uploading the file' });
  }
});

  
  router.get('/file', async (req, res) => {
    try {

      const file = await File.find();
      res.status(200).json(file);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.put('/file/:id', async (req, res) => {
    try {
      const fileId = req.params.id;
      const { name, data } = req.body;
      await File.findByIdAndUpdate(fileId, { name, data });
      res.status(200).json({ message: 'File updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.delete('/file/:id', async (req, res) => {
    try {
      const fileId = req.params.id;
      await File.findByIdAndRemove(fileId);
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
