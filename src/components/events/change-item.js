import { Icon } from 'react-icons-kit';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import {code} from 'react-icons-kit/fa/code';

import './styles.scss';

/**
 * A repository change.
 */
class ChangeItem extends React.Component {
  /**
   * Render component.
   * @returns {XML}
   */
  render () {
    return this.renderTextListing();
  }

  renderCard () {
    return (
      <div className={'event card commit'} id={this.props.data.uuid}>
        <div className={'header'}>
          <div className={'author'}>{this.props.data.author}</div>
          <div className={'date'}>{moment(this.props.data.date).format('MMM DD')}</div>
        </div>
        <div className={'content'}>
          <Icon className={'icon'} icon={code} size={16}/>
          <div className={'message'}>{this.props.data.message}</div>
        </div>
      </div>
    );
  }

  renderTextListing () {
    return (
      <div className={'event commit'} id={this.props.data.uuid}>
        <div className={'row'}>
          <Icon className={'icon'} icon={code} size={16}/>
          <div className={'message'}>{this.props.data.message}</div>
          <div className={'date'}>{moment(this.props.data.date).format('MMM DD')}</div>
        </div>
      </div>
    );
  }
}

ChangeItem.propTypes = {
  data: PropTypes.object
};

export default ChangeItem;
