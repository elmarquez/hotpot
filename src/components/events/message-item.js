import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

/**
 * A user message.
 */
class MessageItem extends React.Component {
  constructor (props) {
    super(props);
    let colour = this.getAvatarColour(props.data.fullName || props.data.fullname || '-');
    let initials = this.getInitials();
    this.state = {
      colour: colour,
      data: props.data,
      initials: initials
    };
  }

  /**
   * Get avatar colour from user initials.
   * @param {String} userId User name, ID or initials
   * @returns {string} HEX colour code
   */
  getAvatarColour (userId) {
    var hash = 0;
    for (var i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

  /**
   * Get user initials to display inside avatar as placeholder.
   * @returns {string}
   */
  getInitials () {
    try {
      let fullName = this.props.data.hasOwnProperty('fullName') ? this.props.data.fullName : this.props.data.fullname;
      let initials = fullName.match(/\b\w/g) || [];
      return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    } catch (err) {
      return '';
    }
  }

  /**
   * Render component.
   * @returns {XML}
   */
  render () {
    let style = {'background-color': this.state.colour};
    return (
      <div className={'event message'}>
        <div className={'row'}>
          <div className={'avatar'} style={style}>
            <span className={'initials'}>{this.state.initials}</span>
          </div>
          <div className={'card'}>
            <p>{this.state.data.message}</p>
          </div>
        </div>
      </div>
    );
  }
}

MessageItem.propTypes = {
  data: PropTypes.object,
  initials: PropTypes.string
};

export default MessageItem;
