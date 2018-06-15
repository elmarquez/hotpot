import { h, Component } from 'preact';
import postal from 'postal';
import Promise from 'bluebird';
import styles from './styles.scss';

class Discussion extends Component {

  constructor(props, state) {
    super(props);
    this.state = {};
    this.state.message = '';
    this.state.messages = [];
  }

  closeWindow () {
    postal.publish({channel:'app', topic:'toggleClientVisibility', data: {}});
  }

  componentDidMount() {
    console.info('client component mounted');
    this
      .connectToServer()
      .then(this.getMessages)
      .catch(err => console.error);
  }

  /**
   * Connect to the chat server.
   * @returns {Promise}
   */
  connectToServer () {
    let self = this;
    return new Promise(function (resolve, reject) {
      try {
        let socket = io();
        self.setState({socket:socket});
        socket.on('discussion', self.handleMessagesUpdate);
        resolve(socket);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get the initial set of chat messages.
   * @returns {Promise}
   */
  getMessages() {
    return new Promise.resolve();
  }

  handleMessageChange (e) {
    console.info('message change', e);
  }

  /**
   * Handle message receipt.
   * @param {Object} msg Data
   */
  handleMessagesUpdate (msg) {
    console.log('received messages', msg);
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state Component state
   * @returns {VNode<{class: string}>}
   */
  render(props, state) {
    if (this.props.visible) {
      return h('div', {class:styles.client}, [
        h('div', {class:styles.header}, [
          this.renderHeader()
        ]),
        h('div', {class:styles.body}, [
          this.renderMessages()
        ]),
        h('div', {class:styles.footer}, [
          this.renderFooter()
        ]),
      ]);
    } else {
      return h('div', {class:'discussion hidden'}, []);
    }
  }

  renderFooter () {
    return (
      <div className={'content'}>
        <input autoComplete={'off'} id={'m'} onChange={this.handleMessageChange} type={'text'} value={this.state.message} />
        <button onClick={this.sendMessage}>Send</button>
      </div>
    );
  }

  renderHeader () {
    return (
      <div className={'content'}>
        <button onClick={this.closeWindow}>x</button>
      </div>
    );
  }

  renderMessages () {
    let messages = this.state.messages.map(m => {
      return h('li', {class:'message'}, [m]);
    });
    return h('ul', {class:'messages'}, messages)
  }

  /**
   * Send message.
   * @param {Object} msg Message
   */
  sendMessage(msg) {
    console.info('send message', msg);
  }

}

export default Discussion;
