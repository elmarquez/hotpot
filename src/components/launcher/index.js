import { h, Component } from 'preact';
import MessageSquare from 'feather-icons/dist/icons/message-square.svg';
import { PropTypes } from 'preact-compat';
import './styles.scss';

class Launcher extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state State
   * @returns {VNode<{class: string}>}
   */
  render(props, state) {
    if (this.props.visible) {
      return (
        <button className={'launcher'} onClick={this.props.toggleVisibility}>
          <img alt={'Hotpot'} src={MessageSquare} />
        </button>
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
