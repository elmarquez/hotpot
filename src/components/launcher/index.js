/**
 * Client application launcher.
 */
import { h, Component } from 'preact';
import { PropTypes } from 'preact-compat';
import HotPotIcon from '../../img/hotpot.svg';
import postal from 'postal';
import styles from './styles.scss';

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
      return h(
        'button',
        { class: styles.launcher, onclick: this.handleClick },
        [<HotPotIcon width="32px" key={'icon'} />]
      );
    } else {
      return h('button', { class: 'hidden' }, []);
    }
  }
}

Launcher.propTypes = {
  visible: PropTypes.boolean
};

export default Launcher;
