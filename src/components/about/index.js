import React from 'react';
import './styles.scss';

class About extends React.Component {
  constructor (props) {
    super(props);
  }

  /**
   * Render the component.
   * @returns {VNode<{class: string}>}
   */
  render () {
    return (<div className={'about'}>About panel</div>);
  }
}

export default About;
