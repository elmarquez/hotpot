import { h, Component } from 'preact';
import { PropTypes } from 'preact-compat';
import postal from 'postal';
import './styles.scss';

class Client extends Component {
  constructor(props, state) {
    super(props);
    this.state = {
      focus: 'discussion'
    };
  }

  closeWindow() {
    postal.publish({
      channel: 'app',
      topic: 'toggleClientVisibility',
      data: {}
    });
  }

  componentDidMount() {
    console.info('client component mounted');
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state Component state
   * @returns {VNode<{class: string}>}
   */
  render(props, state) {
    if (this.props.visible) {
      return (
        <div className={'client'}>
          <div className={'header'}>
            {this.renderHeader()}
          </div>
          <div className={'body'} id={'client-body'}>
            {this.renderMessages()}
          </div>
          <div className={'footer'}>
            <input
              autoComplete={'off'}
              id={'m'}
              onBlur={this.handleInputBlur}
              onChange={this.handleInputValueChange}
              onFocus={this.handleInputFocus}
              type={'text'}
              value={this.state.message}
            />
            <button onClick={this.sendMessage}>Send</button>
          </div>
        </div>
      );
    } else {
      return h('div', { class: 'discussion hidden' }, []);
    }
  }

  renderHeader() {
    return (
      <div className={'tabs'}>
        <button onClick={this.showDiscussionTab}>Discussion</button>
        <button onClick={this.showChangeLogTab}>Changes</button>
        <button onClick={this.closeWindow}>x</button>
      </div>
    );
  }

  showChangeLogTab() {}

  showDiscussionTab() {}
}

Client.propTypes = {
  visible: PropTypes.boolean
};

export default Client;
