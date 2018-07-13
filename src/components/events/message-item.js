import { Icon } from 'react-icons-kit';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import {circle} from 'react-icons-kit/entypo/circle';

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
            {/*<div className={'meta'}>*/}
              {/*<span className={'fullname'}>{this.props.data.fullname}</span>*/}
              {/*<span className={'datetime'}>{moment(this.props.data.createdAt).format('MMM D, h:mm')}</span>*/}
            {/*</div>*/}
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
