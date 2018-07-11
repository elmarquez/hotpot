import MessageSquare from 'feather-icons/dist/icons/message-square.svg';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

class Launcher extends React.Component {
  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state State
   * @returns {VNode<{class: string}>}
   */
  render (props, state) {
    if (this.props.visible) {
      return (
        <button className={'launcher'} onClick={this.props.toggleVisibility}>
          <img alt={'Hotpot'} src={MessageSquare} />
        </button>
      );
    } else {
      return (<button className={'launcher hidden'}>Hotpot</button>);
    }
  }
}

Launcher.propTypes = {
  toggleVisibility: PropTypes.Func,
  visible: PropTypes.bool
};

export default Launcher;
