const fs = require('fs');
const path = require('path');
const pino = require('pino')();

/**
 * Get user avatar.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getAvatar (req, res) {
  let p = path.join(__dirname, 'avatars', req.params.filename);
  res.sendFile(p);
}

/**
 * Get sample logo.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getLogo (req, res) {
  let p = path.join(__dirname, 'logos', req.params.filename);
  res.sendFile(p);
}

/**
 * Get the sample chat page.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getPage (req, res) {
  let f = path.join(__dirname, 'index.html');
  res.sendFile(f);
}

/**
 * Get user profile.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getUser (req, res) {
  let user = {
    uuid: 'c8fdb983-88f5-4eab-85e5-754c6653690c',
    email: 'johndoe@example.com',
    fullName: 'John Doe',
    avatar: 'boy-1.svg'
  };
  res.send(user);
}

/**
 * Register application module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  pino.info('Registering test service');
  ctx.app.get('/', getPage);
  ctx.app.get('/test/avatar/:filename', getAvatar);
  ctx.app.get('/test/logo/:filename', getLogo);
  ctx.app.get('/test/user', getUser);
}

/**
 * Start application module.
 * @param {Object} ctx Application context
 * @returns {Promise.<T>}
 */
function start (ctx) {
  pino.info('Starting client service');
  return Promise.resolve();
}

/**
 * Stop application module.
 * @param {Object} ctx Application context
 * @returns {Promise.<T>}
 */
function stop (ctx) {
  pino.info('Stopping client service');
  return Promise.resolve();
}

module.exports = {
  register: register,
  start: start,
  stop: stop
};
