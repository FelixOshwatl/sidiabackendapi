// File: routes/forms.js
const express = require('express');
const router = express.Router();
const Form = require('../models/form');
const moment = require('moment-timezone');

// GET all forms
router.get('/getforms', async (req, res) => {
  try {
    const allForms = await Form.find();
    res.status(200).json(allForms);
  } catch (error) {
    console.error('Gagal mengambil data:', error);
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
});

router.post('/forms', async (req, res) => {
  try {
    const formData = req.body;

    formData.uploadDate = moment().tz('Asia/Jakarta').startOf('day').toDate();
    formData.fillingDate = moment().tz('Asia/Jakarta').startOf('day').toDate();
    formData.tanggalBerita = moment().tz('Asia/Jakarta').startOf('day').toDate();

    const newForm = await Form.create(formData);
    res.status(201).json(newForm);
  } catch (error) {
    console.error('Gagal menambahkan data:', error);
    res.status(500).json({ error: 'Gagal menambahkan data' });
  }
});

// PUT update form by ID
router.put('/forms:id', async (req, res) => {
  const formId = req.params.id;
  const updatedData = req.body;

  try {
    const result = await Form.findByIdAndUpdate(formId, { $set: updatedData }, { new: true });
    res.json({ message: 'Data berhasil diperbarui', result });
  } catch (error) {
    console.error('Gagal memperbarui data:', error);
    res.status(500).json({ error: 'Gagal memperbarui data' });
  }
});
 
module.exports = router;
