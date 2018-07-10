const Config = require('config');
const Log = require('pino')();
const sendGrid = require('@sendgrid/mail');

const API_KEY = Config.get('SECRETS.SENDGRID.API_KEY');
sendGrid.setApiKey(API_KEY);

/**
 * Send email using the SendGrid API. See the SendGrid documentation
 * for the correct attachements format.
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
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
    attachment: attachments
  };
  return sendGrid
    .sendMultiple(message)
    .then(() => {
      Log.info(`Sent message '${message.subject}' to ${message.to}`);
    })
    .catch((err) => {
      let msg = err.toString();
      Log.error(msg);
      return msg;
    });
}

module.exports = {
  send: send
};
