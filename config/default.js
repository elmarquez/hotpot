// Load application secrets
const secrets = require('/etc/dstg/725sqn/secrets.json');

const config = {
  DATABASE: {
    HOST: 'localhost',
    PORT: '27017',
    NAME: 'nabemono',
    URL: 'mongodb://localhost:27017/nabemono',
  },
  EMAIL_FROM: 'server@725sqn-dev.eresearch.unimelb.edu.au',
  FEEDBACK_DISTRIBUTION_LIST: ['dmarques@unimelb.edu.au'],
  MAIL_SERVICE: 'sendgrid',
  MODULES: ['changelog', 'discussion', 'client'],
  PORT: 3000,
  SECRETS: secrets,
  UPLOAD_SIZE_LIMIT: '50mb'
};

module.exports = config;
