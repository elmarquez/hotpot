import About from '../about';
import AgentIcon from './origami.svg';
import CloseIcon from './close.svg';
import Events from '../events';
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
    this.state = {
      tab: this.TABS.EVENTS
    };
  }

  /**
   * Render the component.
   * @returns {VNode<{class: string}>}
   */
  render () {
    if (this.props.visible) {
      return (
        <div className={'client'}>
          {this.renderHeader()}
          {this.renderBody()}
        </div>
      );
    } else {
      return (<div className={'client hidden'}></div>);
    }
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

Client.propTypes = {
  events: PropTypes.array,
  title: PropTypes.string,
  socket: PropTypes.object,
  toggleVisibility: PropTypes.func,
  user: PropTypes.object,
  visible: PropTypes.bool
};

export default Client;
