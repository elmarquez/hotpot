const config = require('config');
const express = require('express');
const path = require('path');
const pino = require('pino')();
const Promise = require('bluebird');

const URL_BASE = config.get('URL_BASE');

/**
 * Register module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  pino.info('Registering client service');
  ctx.app.use('/client', express.static('build'));
  ctx.app.use('/favicon.ico', express.static(path.join(__dirname, 'favicon.ico')));
}

/**
 * Start module.
 * @returns {Promise.<T>}
 */
function start () {
  pino.info('Starting client service');
  return Promise.resolve();
}

/**
 * Stop module.
 * @returns {Promise.<T>}
 */
function stop () {
  pino.info('Stopping client service');
  return Promise.resolve();
}

module.exports = {
  register: register,
  start: start,
  stop: stop
};
