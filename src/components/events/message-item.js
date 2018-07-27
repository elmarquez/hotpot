import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

/**
 * A user message.
 */
class MessageItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: props.data,
      initials: this.getInitials()
    };
  }

  /**
   * Render component.
   * @returns {XML}
   */
  render () {
    return (
      <div className={'event message'}>
        <div className={'row'}>
          <div className={'avatar'}><span>&nbsp;{this.state.initials}</span></div>
          <div className={'card'}>
            <p>{this.state.data.message}</p>
          </div>
        </div>
      </div>
    );
  }

  getInitials () {
    let fullName = this.props.data.fullName === 'N/A' ? 'A D' : this.props.data.fullName;
    let initials = fullName.match(/\b\w/g) || [];
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  }
}

MessageItem.propTypes = {
  data: PropTypes.object,
  initials: PropTypes.string
};

export default MessageItem;
