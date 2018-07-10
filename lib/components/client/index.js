const express = require('express');
const path = require('path');
const Promise = require('bluebird');

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

/**
 * Start module.
 * @returns {Promise.<T>}
 */
function start () {
  return Promise.resolve();
}

/**
 * Stop module.
 * @returns {Promise.<T>}
 */
function stop () {
  return Promise.resolve();
}

module.exports = {
  register: register,
  start: start,
  stop: stop
};
