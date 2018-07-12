/**
 * Pre-defined record.
 */
const Mongoose = require('mongoose');
const uuid = require('uuid/v4');

const messageSchema = Mongoose.Schema({
  uuid: {type: String, required: true, default: uuid},
  type: {type: String, required: true, default: 'MESSAGE'},
  date: {type: String, required: true},
  user: {type: String, required: true},
  fullname: {type: String, required: false},
  message: {type: String, required: true},
  parent: {type: String, required: false},
  url: {type: String, required: false},
  tags: [{type: String}]
}, {timestamps: true});

module.exports = Mongoose.model('Message', messageSchema);
