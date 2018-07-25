import About from '../about';
import AgentIcon from './origami.svg';
import CloseIcon from './close.svg';
import Events from '../events';
import posed from 'react-pose';
import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

class Chat extends React.Component {
  TABS = {
    ABOUT: 'ABOUT',
    EVENTS: 'EVENTS'
  };

  constructor (props) {
    super(props);
    this.chatDiv = posed.div({
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
    let ChatClient = this.chatDiv;
    return (
      <ChatClient className={'client'} pose={this.props.visible ? 'visible' : 'hidden'}>
        {this.renderHeader()}
        {this.renderBody()}
      </ChatClient>
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
   */
  renderHeader () {
    let title = this.props.title || 'Product Chat';
    return (
      <div className={'header'}>
        <div className={'row agent'}>
          <div className={'avatar'}>
            <img alt={'Product Developer'} src={AgentIcon} />
          </div>
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
   * Set tab.
   * @param {String} tab Tab identifier
   */
  setTab (tab) {
    this.setState({tab: tab});
  }
}

Chat.propTypes = {
  events: PropTypes.array,
  title: PropTypes.string,
  socket: PropTypes.object,
  toggleVisibility: PropTypes.func,
  user: PropTypes.object,
  visible: PropTypes.bool
};

export default Chat;
