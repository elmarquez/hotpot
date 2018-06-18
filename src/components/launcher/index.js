/**
 * Client application launcher.
 */
import { h, Component } from 'preact';
import { PropTypes } from 'preact-compat';
import postal from 'postal';
import './styles.scss';

class Launcher extends Component {
  constructor() {
    super();
    this.state = { visible: true };
  }

  handleClick() {
    postal.publish({
      channel: 'app',
      topic: 'toggleClientVisibility',
      data: {}
    });
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state State
   * @returns {VNode<{class: string}>}
   */
  render(props, state) {
    if (this.props.visible) {
      return h('button', { class: 'launcher', onclick: this.handleClick }, [
        h('img', { class: 'icon' })
      ]);
    } else {
      return h('button', { class: 'hidden' }, []);
    }
  }
}

Launcher.propTypes = {
  visible: PropTypes.boolean
};

export default Launcher;
