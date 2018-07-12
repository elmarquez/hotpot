/**
 * Question to user community.
 */
const Mongoose = require('mongoose');
const uuid = require('uuid/v4');

const questionSchema = Mongoose.Schema({
  uuid: {type: String, required: true, default: uuid},
  type: {type: String, required: true, default: 'QUESTION'},
  date: {type: String, required: true},
  user: {type: String, required: true},
  message: {type: String, required: true},
  tags: [{type: String}]
}, {timestamps: true});

module.exports = Mongoose.model('Question', questionSchema);
