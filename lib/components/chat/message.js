/**
 * Pre-defined record.
 */
const Mongoose = require('mongoose');
const uuid = require('uuid/v4');

const messageSchema = Mongoose.Schema({
  uuid: {type: String, required: true, default: uuid},
  user: {type: String, required: true},
  fullname: {type: String, required:false},
  message: {type: String, required: true},
  parent: {type: String, required: false},
  url: {type: String, required: false},
  tags: [{type: String}],
  visible: {type: Boolean, default: true}
}, {timestamps: true});

module.exports = Mongoose.model('Message', messageSchema);
