const change = require('../../models/change');
const config = require('config');
const pino = require('pino')();
const Promise = require('bluebird');
const {spawn} = require('child_process');

/**
 * Reload the change log.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function loadChangeLog () {
  // TODO needs to accept configuration args
  return new Promise((resolve, reject) => {
    const cmd = spawn('git', ['--no-pager', 'log', '--all']);
    let lines = [];
    cmd.stderr.on('data', (err) => {
      pino.error(err);
      resolve(lines);
    });
    cmd.stdout.on('data', data => {
      lines.push(data.toString('utf8'));
    });
    cmd.on('close', () => {
      resolve(lines);
    });
  });
}


/**
 * Register module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  pino.info('Registering change log service');
}

/**
 * Start application module.
 */
function start () {
  pino.info('Starting change log service');
  return Promise.resolve();
}

/**
 * Stop application module.
 * @returns
 */
function stop () {
  pino.info('Stopping change log service');
  return Promise.resolve();
}

/**
 * Update the change log.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function updateLog (req, res) {
  loadChangeLog()
    .then(logitems => {
      pino.info('updated change log');
      res.send(logitems);
    })
    .catch(err => {
      pino.error(err);
      res.status(500).send(err);
    });
}

module.exports = {
  register: register,
  start: start,
  stop: stop
};
