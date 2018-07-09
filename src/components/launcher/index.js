import { h, Component } from 'preact';
import { PropTypes } from 'preact-compat';
import './styles.scss';

class Launcher extends Component {
  constructor() {
    super();
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state State
   * @returns {VNode<{class: string}>}
   */
  render(props, state) {
    if (this.props.visible) {
      return h(
        'button',
        { class: 'launcher', onclick: this.props.toggleVisibility },
        ['Hotpot']
      );
    } else {
      return h('button', { class: 'launcher hidden' }, ['Hotpot']);
    }
  }
}

Launcher.propTypes = {
  toggleVisibility: PropTypes.Function,
  visible: PropTypes.boolean
};

export default Launcher;
