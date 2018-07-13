/* jshint newcap:false, latedef:false */
/* jshint -W079 */
'use strict';

const Config = require('config');
const Fs = require('fs');
const Path = require('path');
const pino = require('pino')();
const Promise = require('bluebird');
const Render = require('string-template');

const EMAIL_FROM = Config.get('EMAIL_FROM');
const FEEDBACK_DISTRIBUTION_LIST = Config.get('FEEDBACK_DISTRIBUTION_LIST');
const MAIL_SERVICE = Config.get('MAIL_SERVICE');

const mailer = require('./' + MAIL_SERVICE);

var TEMPLATE_CACHE = {};

/**
 * Get message template.
 * @param {String} name Template name
 * @returns {Promise}
 */
function getTemplate (name) {
  if (TEMPLATE_CACHE.hasOwnProperty(name)) {
    return Promise.resolve(TEMPLATE_CACHE[name]);
  } else {
    return loadTemplate(name);
  }
}

/**
 * Load template from file system.
 * @param {String} name
 * @returns {Promise}
 */
function loadTemplate (name) {
  return new Promise(function (resolve, reject) {
    let path = Path.join(__dirname, 'templates', name);
    Fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Register module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  pino.info('Registering messaging service');
}

/**
 * Send user feedback.
 * @param {Object} data Feedback
 * @returns {Promise}
 */
function sendFeedbackEmail (data) {
  data.from = EMAIL_FROM;
  data.subject = 'User Feedback';
  data.to = FEEDBACK_DISTRIBUTION_LIST;
  return sendMessage(data, 'feedback.txt', 'feedback.html', null);
}

/**
 * Send email message.
 * @param {Object} data Message data.
 * @param {String} textTemplate Text message template name
 * @param {String} htmlTemplate HTML message template name
 * @param {Array} attachments array
 * @returns {Promise}
 */
function sendMessage (data, textTemplate, htmlTemplate, attachments = null) {
  return Promise
    .all([
      getTemplate(textTemplate),
      getTemplate(htmlTemplate)
    ])
    .then(function (templates) {
      let text = Render(templates[0], data);
      let html = Render(templates[1], data);
      return mailer.send(data.from, data.to, data.subject, text, html, attachments);
    });
}

/**
 * Start application module.
 * @param {Object} ctx Application context
 * @returns {Promise.<T>}
 */
function start (ctx) {
  pino.info('Starting messaging service');
  ctx.app.on('discussion:message', function (e, d) {
    pino.info('message', e, d);
  });
  return Promise.resolve();
}

/**
 * Stop application module.
 * @param {Object} ctx Application context
 * @returns {Promise.<T>}
 */
function stop (ctx) {
  pino.info('Stopping messaging service');
  return Promise.resolve();
}

module.exports = {
  getTemplate: getTemplate,
  register: register,
  sendFeedbackEmail: sendFeedbackEmail,
  sendMessage: sendMessage,
  start: start,
  stop: stop
};
