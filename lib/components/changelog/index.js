const config = require('config');
const pino = require('pino')();
const Promise = require('bluebird');
const { spawn } = require('child_process');

// TODO
// needs some logic about loading change log from the repo
// periodic? start time?

// MOCK DATA
var LOG = [
  {
    change: '32e5c002-351e-45e3-8a74-32b3a1a3f0ac',
    message: 'Improve presentation, sketch in tabs',
    date: '2011-12-19T15:28:46.493Z',
    fullname: 'Davis Marques <dmarques@unimelb.edu.au>',
    commit: 'ea689312ffa971d12cf33ffec99c020edf391475'
  },
  {
    change: 'b24fbfbc-a8ca-4ad1-a917-a0539c86f7a4',
    message: 'Switch to Parcel bundler. Send, persist, display updated messages in client.',
    date: '2011-12-19T15:28:46.493Z',
    fullname: 'Davis Marques <dmarques@unimelb.edu.au>',
    commit: '48e08fa379fe5a1d07e516c3afef5995ad9ab218'
  },
  {
    change: '2493cc6b-a423-4773-9c76-c3aadeeb58b7',
    message: 'Fix linting issues, linting configuration',
    date: '2011-12-19T15:28:46.493Z',
    fullname: 'Davis Marques <dmarques@unimelb.edu.au>',
    commit: 'ac60d47b1a0901ed5e5fbdb2df77f1c9fd44e09b'
  },
  {
    change: 'db091b44-a27c-4e71-bce9-7944cfe7d18f',
    message: 'Initial commit, setup of preact widget component.',
    date: '2011-12-19T15:28:46.493Z',
    fullname: 'Davis Marques <dmarques@unimelb.edu.au>',
    commit: '8e96c7bc6808eda6453e58fbd47cb3d1daddab7f'
  }
];

/**
 * Get log item.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getLogItem (req, res) {
  res.send(LOG[0]);
}

/**
 * Get log items.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getLogItems (req, res) {
  res.send(LOG);
}

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
  ctx.app.get('/changes', getLogItems);
  ctx.app.get('/changes/:change', getLogItem);
  ctx.app.post('/changes', updateLog);
}

/**
 * Update the change log.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function updateLog (req, res) {
  loadChangeLog()
    .then(logitems => {
      LOG = logitems;
      pino.info('updated change log');
      res.send(logitems);
    })
    .catch(err => {
      LOG = [];
      pino.error(err);
      res.status(500).send(err);
    });
}

module.exports = {
  register: register
};
