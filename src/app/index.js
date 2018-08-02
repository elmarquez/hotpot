/* eslint no-console: 0 */
/* eslint no-restricted-syntax: 0 */
import axios from 'axios/index';
import Client from '../components/client/index';
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
      config: {},
      connected: false,
      events: [],
      launcher: true,
      logo: null,
      title: 'Product Chat',
      user: {
        avatar: '',
        email: '',
        fullName: '',
        path: '',
        uuid: ''
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
    this.getConfiguration = this.getConfiguration.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.handleEventReceived = this.handleEventReceived.bind(this);
    this.handleSocketConnect = this.handleSocketConnect.bind(this);
    this.handleSocketConnectError = this.handleSocketConnectError.bind(this);
    this.handleSocketDisconnect = this.handleSocketDisconnect.bind(this);
    this.handleSocketError = this.handleSocketError.bind(this);
    this.handleSocketReconnect = this.handleSocketReconnect.bind(this);
  }

  /**
   * Handle component mounted event.
   */
  componentDidMount () {
    // TODO enable features
    let self = this;
    self
      .connectToServer()
      .then(() => {
        return Promise.all([self.getUserProfile(), self.getEvents()]);
      })
      .catch(err => {
        if (err.response) {
          console.log(`Can't fetch user details: ${err.response.status}`);
        }
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
        // communicate on the specified socket.io path
        let options = { path: `${self.state.base}/socket.io` };
        let socket = io(self.state.base, options);
        // handlers for socket events
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
      .get(`${self.state.base}/api/config`)
      .then(res => {
        self.setState({config: res.data});
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
    return axios
      .get(`${self.state.base}/api/events`, {withCredentials: true})
      .then(res => {
        self.setState({events: res.data});
      });
  }

  /**
   * Get user profile.
   * @returns {Promise.<TResult>}
   */
  getUserProfile () {
    let self = this;
    let url = `${self.props.user}`;
    return axios
      .get(url, {withCredentials: true})
      .then(res => {
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
    this.setState({connected: true});
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
    this.setState({connected: false});
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
    this.setState({connected: true});
  }

  /**
   * Render the component.
   * @returns {VNode<{class: string}>}
   */
  render () {
    return (
      <div className={'hotpot app'}>
        { this.renderLauncher() }
        { this.renderClient() }
      </div>
    );
  }

  /**
   * Render the client window.
   * @returns {XML}
   */
  renderClient () {
    return (
      <Client
        base={this.state.base}
        config={this.state.config}
        connected={this.state.connected}
        events={this.state.events}
        logo={this.state.logo}
        socket={this.state.socket}
        title={this.state.title}
        toggleVisibility={this.toggleClientVisibility}
        user={this.state.user}
        visible={this.state.client} />
    );
  }

  /**
   * Render launcher widget.
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
  logo: PropTypes.string,
  proxy: PropTypes.object,
  title: PropTypes.string,
  user: PropTypes.string
};

export default App;
