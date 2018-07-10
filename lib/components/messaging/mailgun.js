const Config = require('config');
const Log = require('pino')();
const Promise = require('bluebird');
const Request = require('request');

const DOMAIN = Config.get('SECRETS.MAILGUN.DOMAIN_NAME');
const KEY = Config.get('SECRETS.MAILGUN.API_KEY');
const MAIL_API = 'https://api:' + KEY + '@api.mailgun.net/v3/' + DOMAIN + '/messages';

/**
 * Send email using the Mailgun API.
 * Attachments should be an array of valid fileStreams or
 * specified like :
 *  {
 *   value: {Buffer | FileStream.Readable},
 *   option: {
 *    filename: {String},
 *    contentType: {String}
 *    }
 *  }
 * @param {String} from From email address
 * @param {String} to To email address
 * @param {String} subject Subject line
 * @param {String} text Text message content
 * @param {String} html HTML message content
 * @param {Array} attachments
 * @returns {Promise}
 */
function send (from, to, subject, text, html, attachments = null) {
  let message = {
    uri: MAIL_API,
    formData: {
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html,
      attachment: attachments
    }
  };

  return new Promise(function (resolve, reject) {
    Log.info('sending', message.formData.subject, 'message to', message.formData.to);

    Request.post(message, function (err, response) {
      if (err) {
        Log.info('failed to send', message.formData.subject, 'message to', message.formData.to, response.statusCode, err);
        reject(err);
      } else if (response.statusCode >= 300) {
        Log.info('failed to send', message.formData.subject, 'message to', message.formData.to, response.statusCode, err);
        reject(response.statusMessage);
      } else {
        Log.info('sent message', message.formData.to, message.formData.subject);
        resolve(response);
      }
    });
  });
}

module.exports = {
  send: send
};
