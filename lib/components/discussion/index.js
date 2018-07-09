const config = require('config');
const http = require('http');
const Message = require('./message');
const path = require('path');
const pino = require('pino')();
const socketio = require('socket.io');

// get the release version number
let p = path.join(process.cwd(), 'package.json');
const pkg = require(p);

var CHANNELS = {
  ACTIVITY: 'activity',
  DISCUSSION: 'discussion',
  INTENT: 'intent'
};
var io;

/**
 * Get messages.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getMessages (req, res) {
  Message.find((err, messages) => {
    if (err) {
      pino.error(err);
      res.send([]);
    } else {
      res.send(messages);
    }
  });
}

/**
 * Get application version.
 * @param {Request} req Request
 * @param {Response} res Response
 */
function getVersion (req, res) {
  res.send({version: pkg.version});
}

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
      io.emit(CHANNELS.DISCUSSION, doc);
    }
  });
}

/**
 * Register module.
 * @param {Object} ctx Application context
 */
function register (ctx) {
  ctx.app.get('/messages', getMessages);
  ctx.app.get('/version', getVersion);
  startService(ctx);
}

/**
 * Start chat service.
 * @param {Object} ctx Application context
 */
function startService (ctx) {
  ctx.server = http.Server(ctx.app);
  io = socketio(ctx.server);
  io.on('connection', onConnection);
}

/**
 * Stop the chat service.
 */
function stopService () {}

module.exports = {
  register: register,
  startService: startService,
  stopService: stopService
};
