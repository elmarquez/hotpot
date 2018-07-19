const pino = require('pino')();

var secrets = {};

// Load application secrets
try {
  secrets = require('/etc/hotpot/secrets.json');
} catch (err) {
  pino.error(`Failed to load application secrets: ${err}`);
}

var config = {
  DB_URL: 'mongodb://localhost:27017/hotpot',
  EMAIL_FROM: 'dmarques@unimelb.edu.au',
  FEATURES: ['chat', 'launcher', 'message', 'bot', 'changelog', 'qa'],
  FEEDBACK_DISTRIBUTION_LIST: ['dmarq.ezz@gmail.com'],
  MAIL_SERVICE: 'hotpot-sendgrid',
  MODULES: ['api', 'changelog', 'client', 'mail', 'test'],
  PORT: 3000,
  SECRETS: secrets,
  UPLOAD_SIZE_LIMIT: '20mb',
  URL_BASE: '/hotpot'
};

module.exports = config;
