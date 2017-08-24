const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const urlSchema = require('./url').urlSchema;

const lineSchema = new mongoose.Schema({
  user_id: { type: String },
  links: [ urlSchema ]
}, { versionKey: false });

lineSchema.plugin(mongoosePaginate);

const lineModel = mongoose.model('lineModel', lineSchema);

module.exports = {
  lineSchema,
  lineModel
};
