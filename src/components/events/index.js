import axios from 'axios';
import html2canvas from 'html2canvas';
import { Icon } from 'react-icons-kit';
import io from 'socket.io-client';
import moment from 'moment';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import React from 'react';
// import { yeast } from 'yeast';

import {camera} from 'react-icons-kit/entypo/camera';
import './styles.scss';

/**
 * Events viewer displays a single, time-ordered list of user comments, change
 * events, questions
 */
class Events extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      events: [],
      fullname: 'John Doe',
      message: '',
      messages: [],
      // random: yeast(),
      user: 'c8fdb983-88f5-4eab-85e5-754c6653690c'
    };
    // force function binding to class scope
    this.getEvents = this.getEvents.bind(this);
    this.getScreenshot = this.getScreenshot.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.handleMessageReceived = this.handleMessageReceived.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount () {
    let self = this;
    self.connectToServer();
    // .then(self.getUserProfile)
    // .then(self.getEvents)
    // .catch(err => {
    //   throw new Error(err);
    //   // console.error(err);
    // });
    self
      .getUserProfile()
      .then(self.getEvents)
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
  getEvents () {
    let self = this;
    return axios.get('/events').then(res => {
      self.setState({ events: res.data });
      this.scrollToLastEvent();
    });
  }

  /**
   * Take a screenshot. Hide the launcher and client window temporarily, take
   * a screenshot then reset the view state.
   * @returns {Promise} Canvas with screenshot
   */
  getScreenshot () {
    html2canvas(document.body).then(function(canvas) {
      document.body.appendChild(canvas);
    });
  }

  /**
   * Get user profile.
   * @returns {Promise.<TResult>}
   */
  getUserProfile () {
    let self = this;
    let url = this.props.user || '/user';
    return axios.get(url).then(res => {
      self.setState({ user: res.data });
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
   * Handle message received event.
   * @param {Object} msg Data
   */
  handleMessageReceived (msg) {
    // console.log('received message', msg);
    let messages = this.state.messages.slice();
    messages.push(msg);
    this.setState({ messages: messages });
    this.scrollToLastEvent();
  }

  /**
   * Render the component.
   * @returns {VNode<{class: string}>}
   */
  render () {
    return (
      <div className={'body events'}>
        {this.renderEvents()}
        {this.renderFooter()}
      </div>
    );
  }

  renderAnswer (m) {
    return (<div className={'event answer'}>Answer</div>);
  }

  renderChange (m) {
    return (<div className={'event change'}>Change</div>);
  }

  /**
   * Render events.
   * @returns {JSX.Element}
   */
  renderEvents() {
    let events = this.state.events.map(m => {
      return (
        <div className={'event'} key={m.uuid}>
          <div className={'meta'}>
            <span className={'fullname'}>{m.fullname}</span>
            <span className={'datetime'}>{moment(m.createdAt).format('MMM D, h:mm')}</span>
          </div>
          <div className={'body'}>{m.message}</div>
        </div>
      );
    });
    return (<div className={'events scrollable'}>{events}</div>);
  }

  renderFooter () {
    return (
      <div className={'footer'}>
        <input autoComplete={'off'}
               id={'m'}
               onBlur={this.handleInputBlur}
               onChange={this.handleInputValueChange}
               onFocus={this.handleInputFocus}
               placeholder={'Leave a message'}
               type={'text'}
               value={this.state.message} />
        <Icon icon={camera} onClick={this.getScreenshot} title={'Attach a screenshot'} />
      </div>
    );
  }

  /**
   * Render message.
   * @param {Object} m Message
   * @returns {XML}
   */
  renderMessage (m) {
    return (
      <div className={'event message'} key={m.uuid} title={m.url}>
        <div className={'meta'}>
          <span className={'fullname'}>{m.fullname}</span>
          <span className={'datetime'}>{moment(m.createdAt).format('MMM D, h:mm')}</span>
        </div>
        <div className={'body'}>{m.message}</div>
      </div>
    );
  }

  renderQuestion (m) {
    return (<div className={'event question'}>Message</div>);
  }

  scrollToLastEvent () {
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

Events.propTypes = {
  user: PropTypes.string,
  visible: PropTypes.bool
};

export default Events;
