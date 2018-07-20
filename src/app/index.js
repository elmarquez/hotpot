/* eslint no-console: 0 */
/* eslint no-restricted-syntax: 0 */
import axios from 'axios/index';
import Chat from '../components/chat/index';
import Feedback from '../components/feedback/index';
import merge from 'deepmerge';
import io from 'socket.io-client';
import Launcher from '../components/launcher/index';
import React from 'react';
import Promise from 'bluebird';
import PropTypes from 'prop-types';

import './styles.scss';

class App extends React.Component {
  constructor (props) {
    super(props);
    // default state
    let state = {
      base: '/',
      client: false,
      events: [],
      features: [],
      launcher: true,
      title: 'Product Chat',
      user: {
        avatar: '/example',
        fullname: 'John Doe',
        path: '/user',
        uuid: 'c8fdb983-88f5-4eab-85e5-754c6653690c'
      }
    };
    // assign local configuration from props
    if (props.proxy) {
      let attrs = props.proxy.attributes;
      for (let i = 0; i < attrs.length; i++) {
        let attr = attrs.item(i);
        if (attr.localName === 'data-props') {
          try {
            let data = JSON.parse(attr.value);
            state = merge(state, data);
          } catch (err) {
            console.error('failed to parse habitat configuration');
          }
        } else if (attr.localName.indexOf('data-prop-') === 0) {
          let property = attr.localName.substring(11);
          state[property] = attr.value;
        }
      }
    }
    // assign state
    this.state = state;
    // bind event handlers to the class context
    this.getEvents = this.getEvents.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.handleEventReceived = this.handleEventReceived.bind(this);
    this.handleSocketConnect = this.handleSocketConnect.bind(this);
    this.handleSocketConnectError = this.handleSocketConnectError.bind(this);
    this.handleSocketDisconnect = this.handleSocketDisconnect.bind(this);
    this.handleSocketError = this.handleSocketError.bind(this);
    this.handleSocketReconnect = this.handleSocketReconnect.bind(this);
    // start
  }

  /**
   * Handle component mounted event.
   */
  componentDidMount () {
    // TODO enable features
    let self = this;
    self.connectToServer();
    Promise
      .all([self.getUserProfile(), self.getEvents()])
      .then(() => {

      })
      .catch(err => {
        console.log(err);
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
        let options = {};
        let socket = io(self.state.base, options);
        // TODO add handlers for all socket events
        // TODO handle disconnect by changing the client state
        socket.on('connect', self.handleSocketConnect);
        socket.on('connect_error', self.handleSocketConnectError);
        socket.on('disconnect', self.handleSocketDisconnect);
        socket.on('events', self.handleEventReceived);
        socket.on('reconnect', self.handleSocketReconnect);
        self.setState({socket: socket});
        resolve(socket);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get client configuration.
   * @returns {Promise}
   */
  getConfiguration () {
    let self = this;
    return axios
      .get(`${self.state.base}/config`)
      .then(res => {
        self.setState({features: res.data});
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * Get the initial set of chat messages.
   * @returns {Promise}
   */
  getEvents () {
    let self = this;
    return axios.get('/events').then(res => {
      self.setState({events: res.data});
    });
  }

  /**
   * Get user profile.
   * @returns {Promise.<TResult>}
   */
  getUserProfile () {
    let self = this;
    let url = '/user';
    return axios.get(url).then(res => {
      console.log('user profile', res.data);
      self.setState({user: res.data});
    });
  }

  /**
   * Handle message received event.
   * @param {Object} msg Data
   */
  handleEventReceived (msg) {
    let events = this.state.events.slice();
    events.push(msg);
    this.setState({events: events});
  }

  /**
   * Handle websocket connection.
   */
  handleSocketConnect () {
    console.log('socket connected');
  }

  /**
   * Handle websocket connection error.
   */
  handleSocketConnectError (e) {
    console.log('socket connect error', e);
  }

  /**
   * Handle websocket disconnect.
   */
  handleSocketDisconnect (e) {
    console.log('socket disconnected');
  }

  /**
   * Handle websocket error.
   */
  handleSocketError (e) {
    console.log('socket error', e);
  }

  /**
   * Handle websocket reconnect.
   */
  handleSocketReconnect (e) {
    console.log('socket reconnect');
  }

  /**
   * Render the component.
   * @returns {VNode<{class: string}>}
   */
  render () {
    return (
      <div className={'hotpot app'}>
        {this.renderLauncher()}
        {this.renderChat()}
        {/*{this.renderFeedback()}*/}
      </div>
    );
  }

  /**
   * Render the client window.
   * @returns {XML}
   */
  renderChat () {
    return (
      <Chat
        base={this.state.base}
        events={this.state.events}
        socket={this.state.socket}
        title={this.state.title}
        toggleVisibility={this.toggleClientVisibility}
        user={this.state.user}
        visible={this.state.client} />
    );
  }

  renderFeedback () {
    return (
      <Feedback
        base={this.state.base}
        title={this.state.title}
        user={this.state.user}
        visible={this.state.client} />
    );
  }

  /**
   * Render the launcher.
   * @returns {XML}
   */
  renderLauncher () {
    return (
      <Launcher
        toggleVisibility={this.toggleClientVisibility}
        title={this.state.title}
        visible={this.state.launcher}/>
    );
  }

  toggleClientVisibility = () => {
    this.setState({client: !this.state.client});
  };
}

App.propTypes = {
  base: PropTypes.string,
  channel: PropTypes.string,
  proxy: PropTypes.object,
  title: PropTypes.string,
  user: PropTypes.object
};

export default App;
