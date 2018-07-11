import About from '../about';
import ChangeLog from '../changelog';
import CloseIcon from 'feather-icons/dist/icons/x.svg';
import Discussion from '../discussion';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

class Client extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      tab: 'ABOUT'
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
    if (this.state.tab === 'ABOUT') {
      return (
        <div className={'body'} id={'client-body'} key={'body'}>
          <About />
        </div>
      );
    } else if (this.state.tab === 'CHANGE_LOG') {
      return (
        <div className={'body'} id={'client-body'} key={'body'}>
          <ChangeLog />
        </div>
      );
    } else if (this.state.tab === 'DISCUSSION') {
      return (
        <div className={'body'} id={'client-body'} key={'body'}>
          <Discussion />
        </div>
      );
    }
  }

  /**
   * Render header.
   */
  renderHeader () {
    // TODO display buttons for available services
    // TODO highlight the selected tab
    return (
      <div className={'header'}>
        <div className={'tabs'}>
          <button onClick={() => this.setTab('DISCUSSION')}>Discussion</button>
          <button onClick={() => this.setTab('CHANGE_LOG')}>Changes</button>
          <button onClick={() => this.setTab('ABOUT')}>About</button>
        </div>
        <img className={'close'} onClick={this.props.toggleVisibility} src={CloseIcon} />
      </div>
    );
  }

  /**
   * Set tab.
   * @param {String} tab Tab identifier
   */
  setTab (tab) {
    this.setState({ tab: tab });
  }
}

Client.propTypes = {
  toggleVisibility: PropTypes.Func,
  visible: PropTypes.bool
};

export default Client;
