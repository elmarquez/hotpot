import axios from 'axios';

/**
 * Get log.
 * @param {Object} state State
 */
function getLog(state) {
  axios
    .get('/changelog')
    .then(res => {
      state.changelog = res.data;
    })
    .catch(err => {
      console.error(err);
    });
}

/**
 * Get messages.
 * @param {Object} state State
 */
function getMessages(state) {
  axios
    .get('/messages')
    .then(res => {
      state.messages = res.data;
    })
    .catch(err => {
      console.error(err);
    });
}

/**
 * Send activity indicator.
 * @param {Object} state State
 */
function sendActivity(state) {
  let el = document.getElementById('m');
  let msg = el.value;
  console.info(`sending: ${msg}`);
  state.socket.emit('message', msg); // TODO send user info, comment parent, tags
}

/**
 * Send message.
 * @param {Object} state State
 */
function sendMessage(state) {
  let el = document.getElementById('m');
  let msg = el.value;
  state.socket.emit('discussion', msg); // TODO send user info, comment parent, tags
  el.value = '';
}

/**
 * Toggle the visibility of the client panel.
 * @param {Object} state State
 */
function toggleClientVisibility(state) {
  state.discussion.visible = !state.discussion.visible;
  return state.discussion;
}

module.exports = {
  getLog,
  getMessages,
  sendActivity,
  sendMessage,
  toggleClientVisibility
};
