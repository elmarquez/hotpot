import { h, Component } from 'preact';
import { PropTypes } from 'preact-compat';
import io from 'socket.io-client';
import postal from 'postal';
import Promise from 'bluebird';
import './styles.scss';

class Discussion extends Component {
  constructor(props, state) {
    super(props);
    this.state = {
      fullname: 'John Doe',
      message: '',
      messages: [],
      user: 'c8fdb983-88f5-4eab-85e5-754c6653690c'
    };
    // force function binding to class scope
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageReceived = this.handleMessageReceived.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  closeWindow() {
    postal.publish({
      channel: 'app',
      topic: 'toggleClientVisibility',
      data: {}
    });
  }

  componentDidMount() {
    console.info('client component mounted');
    this.connectToServer().then(this.getMessages).catch(err => {
      console.error(err);
    });
  }

  /**
   * Connect to the chat server.
   * @returns {Promise}
   */
  connectToServer() {
    let self = this;
    return new Promise(function(resolve, reject) {
      try {
        let socket = io();
        self.setState({ socket: socket });
        socket.on('discussion', self.handleMessageReceived);
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
    return Promise.resolve();
  }

  handleMessageChange(e) {
    this.setState({ message: e.target.value });
  }

  /**
   * Handle message receipt.
   * @param {Object} msg Data
   */
  handleMessageReceived(msg) {
    console.log('received message', msg);
    let messages = this.state.messages.slice();
    messages.push(msg);
    this.setState({ messages: messages });
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state Component state
   * @returns {VNode<{class: string}>}
   */
  render(props, state) {
    if (this.props.visible) {
      return (
        <div className={'client'}>
          <div className={'header'}>
            Client
            <button onClick={this.closeWindow}>x</button>
          </div>
          <div className={'body'}>
            {this.renderMessages()}
          </div>
          <div className={'footer'}>
            <input
              autoComplete={'off'}
              id={'m'}
              onChange={this.handleMessageChange}
              type={'text'}
              value={this.state.message}
            />
            <button onClick={this.sendMessage}>Send</button>
          </div>
        </div>
      );
    } else {
      return h('div', { class: 'discussion hidden' }, []);
    }
  }

  renderHeader() {
    return (
      <div className={'content'}>
        <button onClick={this.closeWindow}>x</button>
      </div>
    );
  }

  renderMessages() {
    let messages = this.state.messages.map(m => {
      return h('li', { class: 'message' }, [m.message]);
    });
    return h('ul', { class: 'messages' }, messages);
  }

  /**
   * Send message.
   */
  sendMessage() {
    if (this.state.message !== '') {
      let discussion = {
        fullname: this.state.fullname,
        message: this.state.message,
        user: this.state.user
      };
      this.state.socket.emit('discussion', discussion);
      this.setState({ message: '' });
    }
  }
}

Discussion.propTypes = {
  visible: PropTypes.boolean
};

export default Discussion;
