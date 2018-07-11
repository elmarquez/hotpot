import React from 'react';
import './styles.scss';

class About extends React.Component {
  constructor (props, state) {
    super(props);
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state Component state
   * @returns {VNode<{class: string}>}
   */
  render (props, state) {
    return (<div className={'about'}>About panel</div>);
  }
}

export default About;
