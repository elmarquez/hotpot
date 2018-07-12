const Answers = require('../../models/answer');
const Changes = require('../../models/change');
const Messages = require('../../models/message');
const moment = require('moment');
const pino = require('pino')();
const Questions = require('../../models/question');

/**
 * Get answers.
 * @returns {Promise}
 */
function getAnswers () {
  return new Promise((resolve, reject) => {
    Answers.find((err, docs) => {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

/**
 * Get changes.
 * @returns {Promise}
 */
function getChanges () {
  return new Promise((resolve, reject) => {
    Changes.find((err, docs) => {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

/**
 * Get events in order.
 */
function getEventsInOrder () {
  return Promise
    .all([
      getAnswers(),
      getChanges(),
      getMessages(),
      getQuestions()
    ])
    .then(data => {
      let events = data
        .reduce((arr, d) => {
          return arr.concat(d);
        }, [])
        .sort((a, b) => {
          let d1 = moment(a.date);
          let d2 = moment(b.date);
          return d1.isAfter(d2) ? 1 : -1;
        });
      return events;
    });
}

/**
 * Get messages.
 * @returns {Promise}
 */
function getMessages () {
  return new Promise((resolve, reject) => {
    Messages.find((err, docs) => {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

/**
 * Get questions.
 * @returns {Promise}
 */
function getQuestions () {
  return new Promise((resolve, reject) => {
    Questions.find((err, docs) => {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

module.exports = {
  getEventsInOrder
};
