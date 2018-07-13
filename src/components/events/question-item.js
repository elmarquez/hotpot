import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

/**
 * Question for users.
 */
class QuestionItem extends React.Component {
  /**
   * Render component.
   * @returns {XML}
   */
  render () {
    return (
      <div className={'event question'} key={this.props.key}>
        <div className={'header'}>
          <span className={'title'}>Question</span>
        </div>
        <div className={'content'}>{this.props.data.message}</div>
      </div>
    );
  }
}

QuestionItem.propTypes = {
  data: PropTypes.object,
  key: PropTypes.string
};

export default QuestionItem;
