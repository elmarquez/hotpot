/**
 * Response to question.
 */
const Mongoose = require('mongoose');
const uuid = require('uuid/v4');

const answerSchema = Mongoose.Schema({
  uuid: {type: String, required: true, default: uuid},
  date: {type: String, required: true},
  type: {type: String, required: true, default: 'ANSWER'},
  question: {type: String, required: true},
  user: {type: String, required: true},
  answer: {}
}, {timestamps: true});

module.exports = Mongoose.model('Answer', answerSchema);
