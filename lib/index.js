const config = require('config');
const path = require('path');
const pino = require('pino')();

/**
 * Add application modules.
 * @param {Object} app Express application
 */
module.exports = function (app) {
  // load application modules
  let modules = config.get('MODULES');
  modules.forEach(function (module) {
    pino.info(`Loading ${module} module`);
    let m = path.join(process.cwd(), 'lib', 'components', module);
    let mod = require(m);
    mod.register({app: app});
    mod.start();
  });
};
