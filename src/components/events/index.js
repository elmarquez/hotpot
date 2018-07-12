import AriaModal from 'react-aria-modal';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { Icon } from 'react-icons-kit';
import io from 'socket.io-client';
import moment from 'moment';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import React from 'react';

import {camera} from 'react-icons-kit/entypo/camera';
import {megaphone} from 'react-icons-kit/entypo/megaphone';
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
      modalActive: false,
      screenshot: null,
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
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
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
    let self = this;
    html2canvas(document.body).then((canvas) => {
      self.setState({screenshot: canvas});
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
    this.setState({message: e.target.value});
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
   * Handle message submit.
   * @param {Event} event Event
   */
  handleMessageSubmit (event) {
    event.preventDefault();
    if (this.state.message !== '') {
      let discussion = {
        fullname: this.state.fullname,
        message: this.state.message,
        user: this.state.user,
        url: window.location.href
      };
      this.state.socket.emit('discussion', discussion);
      this.setState({message: ''});
    }
  }

  hideModal () {
    this.setState({screenshot: null, showModal: false});
  }

  /**
   * Render the component.
   * @returns {VNode<{class: string}>}
   */
  render () {
    let modal = this.state.screenshot !== null ? this.renderScreenshotModal() : '';
    return (
      <div className={'body events'}>
        {this.renderEvents()}
        {this.renderFooter()}
        {modal}
      </div>
    );
  }

  /**
   * Render answer event.
   * @param {Object} data Data
   * @param {String} key Key
   * @returns {XML}
   */
  renderAnswer (data, key) {
    return (<div className={'event answer'} key={key}>Answer</div>);
  }

  /**
   * Render change event.
   * @param {Object} data Data
   * @param {String} key Key
   * @returns {XML}
   */
  renderChange (data, key) {
    return (<div className={'event change'} key={key}>Change</div>);
  }

  /**
   * Render events.
   * @returns {XML}
   */
  renderEvents () {
    let events = this.state.events.map((m, i) => {
      if (m.type && m.type === 'ANSWER') {
        return this.renderAnswer(m, i);
      } else if (m.type && m.type === 'CHANGE') {
        return this.renderChange(m, i);
      } else if (m.type && m.type === 'MESSAGE') {
        return this.renderMessage(m, i);
      } else if (m.type && m.type === 'QUESTION') {
        return this.renderQuestion(m, i);
      }
    });
    return (<div className={'events scrollable'}>{events}</div>);
  }

  /**
   * Render footer.
   * @returns {XML}
   */
  renderFooter () {
    return (
      <div className={'footer'}>
        <form onSubmit={this.handleMessageSubmit}>
          <input autoComplete={'off'}
                 onChange={this.handleInputValueChange}
                 placeholder={'Leave a message'}
                 type={'text'}
                 value={this.state.message} />
        </form>
        <Icon className={'control screenshot'} icon={camera} onClick={this.getScreenshot} title={'Attach a screenshot'} />
      </div>
    );
  }

  /**
   * Render message.
   * @param {Object} m Message
   * @returns {XML}
   */
  renderMessage (m, key) {
    return (
      <div className={'event message'} key={key}>
        <div className={'meta'}>
          <span className={'fullname'}>{m.fullname}</span>
          <span className={'datetime'}>{moment(m.createdAt).format('MMM D, h:mm')}</span>
        </div>
        <p className={'content'}>{m.message}</p>
      </div>
    );
  }

  /**
   * Render question.
   * @param {Object} data Data
   * @param {String} key Element key
   * @returns {XML}
   */
  renderQuestion (data, key) {
    return (<div className={'event question'} key={key}>
      <div className={'header'}>
        <span className={'title'}>Question</span>
      </div>
      <div className={'content'}>{data.message}</div>
    </div>);
  }

  /**
   * Render screenshot modal dialog.
   * @returns {XML}
   */
  renderScreenshotModal () {
    let self = this;
    setTimeout(() => {
      document.getElementById('screenshot').appendChild(self.state.screenshot);
    }, 50);
    return (
      <AriaModal onExit={this.hideModal} titleText={'Screenshot'}>
        <div className="modal screenshot">
          <div className="modal-body">
            <div className={'preview'}>
              Screenshot goes here
              <div id="screenshot"></div>
            </div>
            <div className={'sidebar'}>
              <div className={'tools'}>Painting and annotation tools</div>
              <div className={'inset'}>
                <div className={'comment'}>Text feedback here</div>
              </div>
              <div className={'controls'}>
                <button id="demo-one-deactivate" onClick={this.hideModal}>
                  Cancel
                </button>
                <button id="demo-one-deactivate" onClick={this.hideModal}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </AriaModal>
    )
  }

  /**
   * Scroll the panel to the last event.
   */
  scrollToLastEvent () {
    var div = document.getElementById('client-body');
    if (div) {
      div.scrollTop = div.scrollHeight;
    }
  }

  showModal () {
    this.setState({showModal: true});
  }
}

Events.propTypes = {
  user: PropTypes.string,
  visible: PropTypes.bool
};

export default Events;
