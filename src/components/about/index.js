import { h, Component } from 'preact';
import './styles.scss';

class About extends Component {
  constructor(props, state) {
    super(props);
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state Component state
   * @returns {VNode<{class: string}>}
   */
  render(props, state) {
    return h('div', { class: 'about' }, ['About panel']);
  }
}

export default About;
