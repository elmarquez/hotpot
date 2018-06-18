const express = require('express');

/**
 * Register module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  ctx.app.get('/manifest.json', function (req, res) {
    res.send({manifest:'content', modules:[]});
  });
  ctx.app.use('/client', express.static('build'));
}

module.exports = {
  register: register
};
