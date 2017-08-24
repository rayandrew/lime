const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: { type: String },
  shortUrl: { type: String }
}, { _id: false });

const urlModel = mongoose.model('urlModel', urlSchema);

module.exports = {
  urlSchema,
  urlModel
};
