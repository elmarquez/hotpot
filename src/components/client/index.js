import About from '../about';
import AgentIcon from './origami.svg';
import CloseIcon from './close.svg';
import Events from '../events';
import Feedback from '../feedback/index';
import posed from 'react-pose';
import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

class Client extends React.Component {
  TABS = {
    ABOUT: 'ABOUT',
    EVENTS: 'EVENTS'
  };

  constructor (props) {
    super(props);
    this.chatDiv = posed.div({
      disconnected: {bottom: 90, right: 20, opacity: 0.5, transition: '1s all ease-in-out'},
      hidden: {bottom: 90, right: -340, opacity: 0, transition: '1s all ease-in-out'},
      visible: {bottom: 90, right: 20, opacity: 1, transition: '1s all ease-in-out'}
    });
    this.state = {tab: this.TABS.EVENTS};
  }

  /**
   * Render the component.
   * @returns {XML}
   */
  render () {
    let ClientClient = this.chatDiv;
    let pose = this.props.visible && this.props.connected ?
      'visible' : this.props.visible && !this.props.connected ?
      'disconnected' : 'hidden';
    return (
      <ClientClient className={'client'} pose={pose}>
        {this.renderHeader()}
        {this.renderBody()}
      </ClientClient>
    );
  }

  /**
   * Render client body.
   * @returns {XML}
   */
  renderBody () {
    if (this.state.tab === this.TABS.ABOUT) {
      return (<About />);
    } else if (this.state.tab === this.TABS.EVENTS) {
      return (<Events events={this.props.events} socket={this.props.socket} user={this.props.user} />);
    }
  }

  /**
   * Render header.
   * @returns {XML}
   */
  renderHeader () {
    let title = this.props.title || 'Product Client';
    return (
      <div className={'header'}>
        <div className={'row agent'}>
          {this.renderLogo()}
          <div className={'title'}>{title}</div>
          <img className={'close'} onClick={this.props.toggleVisibility} src={CloseIcon} />
        </div>
        <div className={'row hello'}>
          Thanks for visiting! We’re away right now but if you have a suggestion,
          feel free to leave a message and we&apos;ll get back to you soon!
        </div>
      </div>
    );
  }

  /**
   * Render logo.
   * @returns {XML}
   */
  renderLogo () {
    let classes = this.props.logo ? 'logo external' : 'logo';
    let url = this.props.logo ? this.props.logo : AgentIcon;
    return (
      <div className={classes}>
        <img alt={'Product Developer'} src={url} />
      </div>
    );
  }

  /**
   * Set tab.
   * @param {String} tab Tab identifier
   */
  setTab (tab) {
    this.setState({tab: tab});
  }
}

Client.propTypes = {
  connected: PropTypes.bool,
  events: PropTypes.array,
  logo: PropTypes.string,
  title: PropTypes.string,
  socket: PropTypes.object,
  toggleVisibility: PropTypes.func,
  user: PropTypes.object,
  visible: PropTypes.bool
};

export default Client;
