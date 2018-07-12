const data = require('./data');
const http = require('http');
const Message = require('../../models/message');
// const path = require('path');
const pino = require('pino')();
const Promise = require('bluebird');
const socketio = require('socket.io');
// const { spawn } = require('child_process');

// get the release version number
// let p = path.join(process.cwd(), 'package.json');
// const pkg = require(p);

var CHANNELS = {
  ACTIVITY: 'activity',
  DISCUSSION: 'discussion',
  INTENT: 'intent'
};

// application module state
var context = {
  app: null,
  io: null
};

/**
 * Get events in chronological order.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getEvents (req, res) {
  data
    .getEventsInOrder()
    .then(events => {
      res.send(events);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

// /**
//  * Reload the change log.
//  * @param {Request} req Request
//  * @param {Response} res Response
//  */
// function loadChangeLog () {
//   // TODO needs to accept configuration args
//   return new Promise((resolve, reject) => {
//     const cmd = spawn('git', ['--no-pager', 'log', '--all']);
//     let lines = [];
//     cmd.stderr.on('data', (err) => {
//       pino.error(err);
//       resolve(lines);
//     });
//     cmd.stdout.on('data', data => {
//       lines.push(data.toString('utf8'));
//     });
//     cmd.on('close', () => {
//       resolve(lines);
//     });
//   });
// }

/**
 * Handle socket connection.
 * @param {Socket} socket Websocket connection
 */
function onConnection (socket) {
  socket.on('activity', onChannelActivity);
  socket.on('disconnect', onChannelDisconnect);
  socket.on('discussion', onChannelMessage);
}

/**
 * Handle channel activity.
 * @param data
 */
function onChannelActivity (data) {
  pino.info(`channel activity ${data}`);
}

/**
 * Handle user disconnect event.
 * @param data
 */
function onChannelDisconnect (data) {
  pino.info(`user disconnected`);
}

/**
 * Handle channel message.
 * @param {Object} data Message
 */
function onChannelMessage (data) {
  let m = new Message({
    user: data.user,
    fullname: data.fullname,
    message: data.message,
    parent: null,
    url: data.url
  });
  m.save((err, doc) => {
    if (err) {
      pino.error(err);
    } else {
      pino.info(`saved message from ${data.user}`);
      context.io.emit(CHANNELS.DISCUSSION, doc);
      context.app.emit('discussion:message', doc);
    }
  });
}

/**
 * Register module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  context.app = ctx.app;
  ctx.app.get('/events', getEvents);
  context.server = http.Server(context.app);
  ctx.server = context.server; // WARNING side effect!!!
}

/**
 * Start application module.
 */
function start () {
  context.io = socketio(context.server);
  context.io.on('connection', onConnection);
  return Promise.resolve();
}

/**
 * Stop application module.
 * @returns
 */
function stop () {
  return Promise.resolve();
}

// /**
//  * Update the change log.
//  * @param {Request} req Request
//  * @param {Response} res Response
//  */
// function updateLog (req, res) {
//   loadChangeLog()
//     .then(logitems => {
//       pino.info('updated change log');
//       res.send(logitems);
//     })
//     .catch(err => {
//       pino.error(err);
//       res.status(500).send(err);
//     });
// }

module.exports = {
  register: register,
  start: start,
  stop: stop
};
