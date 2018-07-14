import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

/**
 * A user message.
 */
class MessageItem extends React.Component {
  /**
   * Render component.
   * @returns {XML}
   */
  render () {
    return (
      <div className={'event message'} key={this.props.key}>
        <div className={'row'}>
          <div className={'avatar'}>&nbsp;</div>
          <div className={'card'}>
            <p>{this.props.data.message}</p>
          </div>
        </div>
      </div>
    );
  }
}

MessageItem.propTypes = {
  data: PropTypes.object,
  key: PropTypes.string
};

export default MessageItem;
