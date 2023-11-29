const { ObjectID } = require("bson");
const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone")


const formSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId, // Tipe data untuk _id
    name: { type: String, required: true },
    uploadDate: { type: Date, default: () => moment().tz('Asia/Jakarta').toDate() },
    fillingDate: { type: Date, default: () => moment().tz('Asia/Jakarta').toDate() },
    nomorBA: { type: String, required: true },
    Perhial: { type: String, required: true },
    tanggalBerita: { type: Date, default: () => moment().tz('Asia/Jakarta').toDate() },
    pihatPertama: { type: String, required: true },
    pihatKedua: { type: String, required: true },
    currentVersion: { type: String, required: true },
    dropdownOption: [{ type: String }]
});

const FormModel = mongoose.model('Form', formSchema);

module.exports = FormModel;