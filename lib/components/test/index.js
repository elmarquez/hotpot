const config = require('config');
const path = require('path');

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
 * Register module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  ctx.app.get('/', getPage);
}

module.exports = {
  register: register
};
