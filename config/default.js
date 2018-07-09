module.exports = {
  DATABASE: {
    HOST: 'localhost',
    PORT: '27017',
    NAME: 'nabemono',
    URL: 'mongodb://localhost:27017/nabemono',
  },
  MODULES: ['changelog', 'discussion', 'client'],
  PORT: 3000,
  UPLOAD_SIZE_LIMIT: '50mb'
};
