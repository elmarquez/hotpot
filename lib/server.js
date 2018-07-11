/**
 * Application server.
 */
const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const logger = require('express-pino-logger')();
const mongoose = require('mongoose');
const path = require('path');
const pino = require('pino')();
const Promise = require('bluebird');
const { spawn } = require('child_process');

// environment ----------------------------------------------------------------

// Valid deployment environments are either development or production. If an
// environment has not been specified then default to development.
if (process.argv.indexOf('--production') > -1) {
  process.env.NODE_ENV = 'production';
} else {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
}
pino.info('Environment is %s', process.env.NODE_ENV.toUpperCase());

// application ----------------------------------------------------------------

/**
 * Handle cross origin request.
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function handleCorsRequest (ctx) {
  // FIXME COTR-39 Temporary setup to allow easier UI development. remove this once docker setup is ready.
  ctx.app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  return ctx;
}

/**
 * Create express application.
 * See discussion on upload size limit here https://stackoverflow.com/questions/19917401/error-request-entity-too-large
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function createApplication (ctx) {
  ctx.app = express();
  ctx.app.use(bodyParser.json({limit: ctx.CFG.UPLOAD_SIZE_LIMIT, type: 'application/json'}));
  ctx.app.use(bodyParser.urlencoded({extended: true}));
  ctx.app.use(logger);
  return ctx;
}

/**
 * Create application shutdown handlers.
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function createShutdownHandlers (ctx) {
  function handleShutdown (sig) {
    pino.info('Received %s shutdown signal', sig);
    process.exit(0);
  }

  process.on('SIGINT', function () {
    handleShutdown('SIGINT');
  });

  process.on('SIGTERM', function () {
    handleShutdown('SIGTERM');
  });

  return ctx;
}

/**
 * Get current commit SHA.
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function getCommitSha (ctx) {
  return new Promise((resolve, reject) => {
    const cmd = spawn('git', ['rev-parse', 'HEAD']);
    let sha = '';
    cmd.stderr.on('data', (err) => {
      pino.error(`${err}`);
      ctx.app.locals.releaseSha = '00000000';
      resolve(ctx);
    });
    cmd.stdout.on('data', (data) => { sha += data; });
    cmd.on('close', () => {
      ctx.app.locals.releaseSha = sha.substring(0, 8);
      resolve(ctx);
    });
  });
}

/**
 * Get package version ID.
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function getPackageVersionId (ctx) {
  let p = path.join(process.cwd(), 'package.json');
  let pkg = require(p);
  ctx.app.locals.releaseId = pkg.version;
  return ctx;
}

/**
 * Load application modules.
 * @param {Object} ctx Context
 * @returns {Promise}
 */
function loadApplicationModules (ctx) {
  let modules = config.get('MODULES');
  modules.push('test');
  return new Promise(function (resolve, reject) {
    modules.forEach(function (module) {
      pino.info(`Loading ${module} module`);
      let m = path.join(process.cwd(), 'lib', 'components', module);
      let mod = require(m);
      mod.register(ctx);
      mod.start();
    });
    resolve(ctx);
  });
}

/**
 * Load configuration.
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function loadConfiguration (ctx) {
  pino.info('Configuration loaded from %s', config.util.getEnv('NODE_CONFIG_DIR'));
  if (process.argv.indexOf('--show-config') > -1) {
    pino.info(config);
  }
  return ctx;
}

/**
 * Start application.
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function startApplication (ctx) {
  return new Promise(function (resolve, reject) {
    if (ctx.server) {
      ctx.server.listen(ctx.CFG.PORT, () => {
        pino.info('HTTP server started on port ' + ctx.CFG.PORT);
        resolve();
      });
    } else {
      ctx.app.listen(ctx.CFG.PORT, () => {
        pino.info('Express server started on port ' + ctx.CFG.PORT);
        resolve();
      });
    }
  });
}

// database -------------------------------------------------------------------

/**
 * Connect to Mongo database.
 * @param {Object} ctx Server context
 * @returns {Promise}
 */
function connectToDatabase (ctx) {
  return new Promise(function (resolve, reject) {
    // mongoose.Promise = Promise;
    if (process.argv.indexOf('--debug-mongoose') > -1) {
      pino.info('Enabled mongoose debugging');
      mongoose.set('debug', true);
    }
    pino.info('Connecting to database %s', ctx.CFG.DB_URL);
    mongoose.connect(ctx.CFG.DB_URL, {useNewUrlParser: true});
    ctx.app.locals.db = mongoose.connection;
    ctx.app.locals.db.on('error', function (err) {
      pino.error(err);
      reject(err);
    });
    ctx.app.locals.db.on('open', function () {
      pino.info('Connected to database');
      resolve(ctx);
    });
  });
}

// sanity checks --------------------------------------------------------------

/**
 * Check environment to ensure that application requirements are met.
 * @param {Object} ctx Context
 * @returns {Promise}
 */
function doSanityChecks (ctx) {
  return Promise.resolve(ctx);
}

// launch ---------------------------------------------------------------------

var ctx = {
  app: null,
  CFG: {
    DB_URL: config.get('DATABASE.URL'),
    PORT: config.get('PORT'),
    UPLOAD_SIZE_LIMIT: config.get('UPLOAD_SIZE_LIMIT')
  }
};

doSanityChecks(ctx)
  .then(loadConfiguration)
  .then(createApplication)
  .then(connectToDatabase)
  .then(createShutdownHandlers)
  .then(loadApplicationModules)
  .then(handleCorsRequest)
  .then(getPackageVersionId)
  .then(getCommitSha)
  .then(startApplication)
  .catch(function (err) {
    pino.error(err);
    process.exit(1);
  });
