import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

class ChangeLog extends React.Component {
  constructor (props, state) {
    super(props);
    this.state = {
      messages: []
    };
  }

  /**
   * Get the initial set of change log messages.
   * @returns {Promise}
   */
  getChangeLog () {
    let self = this;
    return axios.get('/changes').then(res => {
      self.setState({ messages: res.data });
      this.scrollToLatestMessage();
    });
  }

  /**
   * Render component.
   * @param props
   * @param state
   * @returns {XML}
   */
  render (props, state) {
    return (<div className={'changelog'}>{this.renderChanges()}</div>);
  }

  renderChanges () {
    let changes = this.state.messages.map((m, i) => {
      return (
        <div className={'change'} id={m.uuid} key={i}>
          <div className={'meta'}>
            <span className={'fullname'}>{m.fullname}</span>
            <span className={'datetime'}>{moment(m.createdAt).format('MMM D, h:mm')}</span>
          </div>
          <div className={'body'}>{m.message}</div>
        </div>
      );
    });
    return (<div className={'changes'}>{changes}</div>);
  }

  scrollToLatestMessage () {
    let div = document.getElementById('client-body');
    if (div) {
      div.scrollTop = div.scrollHeight;
    }
  }
}

ChangeLog.propTypes = {
  visible: PropTypes.bool
};

export default ChangeLog;
