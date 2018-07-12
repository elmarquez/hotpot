/**
 * Message announcing a change made to the application.
 */
const Mongoose = require('mongoose');
const uuid = require('uuid/v4');

const changeSchema = Mongoose.Schema({
  uuid: {type: String, required: true, default: uuid},
  type: {type: String, required: true, default: 'CHANGE'},
  author: {type: String, required: true},
  commit: {type: String, required: false},
  date: {type: String, required: true},
  message: {type: String, required: true}
}, {timestamps: true});

module.exports = Mongoose.model('Change', changeSchema);
