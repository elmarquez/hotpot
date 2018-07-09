const express = require('express');
const path = require('path');

/**
 * Register module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  ctx.app.use('/client', express.static('build'));
  ctx.app.use('/favicon.ico', express.static(path.join(__dirname, 'favicon.ico')));
  ctx.app.get('/manifest.json', function (req, res) {
    res.send({manifest: 'content', modules: []});
  });
}

module.exports = {
  register: register
};
