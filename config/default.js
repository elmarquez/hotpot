module.exports = {
  DATABASE: {
    HOST: 'localhost',
    PORT: '27017',
    NAME: 'nabemono',
    URL: 'mongodb://localhost:27017/nabemono',
  },
  MODULES: ['changelog', 'chat', 'client', 'messaging'],
  PORT: 8011,
  UPLOAD_SIZE_LIMIT: '50mb'
};
