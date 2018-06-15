const express = require('express');

/**
 * Register module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  ctx.app.use(express.static('static'));
}

module.exports = {
  register: register
};
