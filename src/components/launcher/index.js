import MessageSquare from './message-square.svg';
import posed from 'react-pose';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

class Launcher extends React.Component {
  constructor (props) {
    super(props);
    this.launchButton = posed.button({
      hidden: {bottom: -100, right: 20, transition: '1s all ease-in-out'},
      open: {bottom: 20, right: 20, transition: '1s all ease-in-out'},
      visible: {bottom: 20, right: 20, transition: '1s all ease-in-out'}
    });
    this.state = {open: false, visible: false};
  }

  /**
   * Handle component did mount life cycle event.
   */
  componentDidMount () {
    const self = this;
    setTimeout(() => {
      if (self.props.visible === true) {
        self.setState({visible: true});
      }
    }, 200);
  }

  /**
   * Render the component.
   * @returns {XML}
   */
  render () {
    let LaunchButton = this.launchButton;
    return (
      <LaunchButton
        className={'launcher'}
        onClick={this.props.toggleVisibility}
        pose={this.state.visible ? 'visible' : 'hidden'}
        title={this.props.title}>
        <img alt={'Hotpot'} src={MessageSquare} />
      </LaunchButton>
    );
  }
}

Launcher.propTypes = {
  toggleVisibility: PropTypes.func,
  title: PropTypes.string,
  visible: PropTypes.bool
};

export default Launcher;
