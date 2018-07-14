// Load application secrets
const secrets = require('/etc/hotpot/secrets.json');

const config = {
  DATABASE: {
    HOST: 'localhost',
    PORT: '27017',
    NAME: 'hotpot',
    URL: 'mongodb://localhost:27017/hotpot',
  },
  EMAIL_FROM: 'dmarques@unimelb.edu.au',
  FEEDBACK_DISTRIBUTION_LIST: ['dmarques@unimelb.edu.au'],
  MAIL_SERVICE: 'sendgrid',
  MODULES: ['events', 'client'],
  PORT: 3000,
  SECRETS: secrets,
  UPLOAD_SIZE_LIMIT: '50mb',
  URL_BASE: '/test'
};

module.exports = config;
