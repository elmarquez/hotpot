const fs = require('fs');
const path = require('path');

// load avatars list
var AVATARS = [];
fs.readdir(path.join(__dirname, 'avatars'), (err, files) => {
  AVATARS = files;
});

/**
 * Get user avatar.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getAvatar (req, res) {
  res.sendFile('public/img/background.png');
}

/**
 * Get the sample chat page.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getPage (req, res){
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
    uuid: 'userid',
    fullname: 'J',
    avatar: '/'
  };
  res.send(user);
}

/**
 * Register application module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  ctx.app.get('/', getPage);
  ctx.app.get('/user', getUser);
  ctx.app.get('/user/avatar', getAvatar);
}

/**
 * Start application module.
 * @param {Object} ctx Application context
 * @returns {Promise.<T>}
 */
function start (ctx) {
  return Promise.resolve();
}

/**
 * Stop application module.
 * @param {Object} ctx Application context
 * @returns {Promise.<T>}
 */
function stop (ctx) {
  return Promise.resolve();
}

module.exports = {
  register: register,
  start: start,
  stop: stop
};
