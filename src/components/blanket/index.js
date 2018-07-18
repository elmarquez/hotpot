import posed from 'react-pose';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';

class Blanket extends React.Component {
  constructor (props) {
    super(props);
    this.div = posed.div({
      visible: {},
      hidden: {}
    })
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

Blanket.propTypes = {
  onClick: PropTypes.func
};

export default Blanket;
