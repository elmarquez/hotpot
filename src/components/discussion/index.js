import axios from 'axios';
import io from 'socket.io-client';
import moment from 'moment';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

class Discussion extends React.Component {
  constructor (props, state) {
    super(props);
    this.state = {
      fullname: 'John Doe',
      message: '',
      messages: [],
      user: 'c8fdb983-88f5-4eab-85e5-754c6653690c'
    };
    // force function binding to class scope
    this.getMessages = this.getMessages.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.handleMessageReceived = this.handleMessageReceived.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount () {
    this
      .connectToServer()
      .then(this.getMessages)
      .catch(err => {
        throw new Error(err);
        // console.error(err);
      });
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
        self.setState({ socket: socket });
        socket.on('discussion', self.handleMessageReceived);
        // TODO handle disconnect by changing the client state
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
  getMessages () {
    let self = this;
    return axios.get('/messages').then(res => {
      self.setState({ messages: res.data });
      this.scrollToLatestMessage();
    });
  }

  handleInputBlur () {
    // console.info('input blur');
  }

  handleInputFocus () {
    // console.info('input focus');
  }

  /**
   * Handle message input value change.
   * @param {Event} e Event
   */
  handleInputValueChange (e) {
    this.setState({ message: e.target.value });
    // if the last key press was the enter key then send the message
    this.sendMessage();
  }

  /**
   * Handle message receipt.
   * @param {Object} msg Data
   */
  handleMessageReceived (msg) {
    // console.log('received message', msg);
    let messages = this.state.messages.slice();
    messages.push(msg);
    this.setState({ messages: messages });
    this.scrollToLatestMessage();
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state Component state
   * @returns {VNode<{class: string}>}
   */
  render (props, state) {
    return (
      <div className={'discussion'} key={'discussion'}>
        <div className={'body'} id={'client-body'} key={'body'}>
          {this.renderMessages()}
        </div>
        <div className={'footer'} key={'footer'}>
          <input
            autoComplete={'off'}
            id={'m'}
            onBlur={this.handleInputBlur}
            onChange={this.handleInputValueChange}
            onFocus={this.handleInputFocus}
            type={'text'}
            value={this.state.message}
          />
          <button onClick={this.sendMessage}>Send</button>
        </div>
      </div>
    );
  }

  /**
   * Render messages.
   * @returns {JSX.Element}
   */
  renderMessages () {
    let messages = this.state.messages.map(m => {
      return (
        <div className={'message'} key={m.uuid} title={m.url}>
          <div className={'meta'}>
            <span className={'fullname'}>{m.fullname}</span>,
            <span className={'datetime'}>{moment(m.createdAt).format('MMM D, h:mm')}</span>
          </div>
          <div className={'body'}>{m.message}</div>
        </div>
      );
    });
    return (<div className={'messages'}>{messages}</div>);
  }

  scrollToLatestMessage () {
    var div = document.getElementById('client-body');
    if (div) {
      div.scrollTop = div.scrollHeight;
    }
  }

  /**
   * Send message.
   */
  sendMessage () {
    if (this.state.message !== '') {
      let discussion = {
        fullname: this.state.fullname,
        message: this.state.message,
        user: this.state.user,
        url: window.location.href
      };
      this.state.socket.emit('discussion', discussion);
      this.setState({ message: '' });
    }
  }
}

Discussion.propTypes = {
  visible: PropTypes.bool
};

export default Discussion;