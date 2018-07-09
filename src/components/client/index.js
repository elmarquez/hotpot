import { h, Component } from 'preact';
import About from '../about';
import ChangeLog from '../changelog';
import Discussion from '../discussion';
import { PropTypes } from 'preact-compat';
import './styles.scss';

class Client extends Component {
  constructor(props, state) {
    super(props);
    this.state = {
      tab: 'ABOUT'
    };
  }

  /**
   * Handle component mounted life cycle event.
   */
  componentDidMount() {
    // console.info('client component mounted');
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state Component state
   * @returns {VNode<{class: string}>}
   */
  render(props, state) {
    console.log('render client');
    if (this.props.visible) {
      return h('div', { class: 'client' }, [
        this.renderHeader(),
        this.renderBody()
      ]);
    } else {
      return h('div', { class: 'client hidden' }, []);
    }
  }

  /**
   * Render client body.
   * @returns {XML}
   */
  renderBody() {
    if (this.state.tab === 'ABOUT') {
      return (
        <div className={'body'} id={'client-body'} key={'body'}>
          <About />
        </div>
      );
    } else if (this.state.tab === 'CHANGE_LOG') {
      return (
        <div className={'body'} id={'client-body'} key={'body'}>
          <ChangeLog />
        </div>
      );
    } else if (this.state.tab === 'DISCUSSION') {
      return (
        <div className={'body'} id={'client-body'} key={'body'}>
          <Discussion />
        </div>
      );
    }
  }

  /**
   * Render header.
   */
  renderHeader() {
    // TODO display buttons for available services
    // TODO highlight the selected tab
    return h('div', { class: 'header', key: 'header' }, [
      h('div', { class: 'tabs', key: 'tabs' }, [
        h(
          'button',
          {
            class: 'header',
            key: 't0',
            onclick: () => {
              this.setTab('DISCUSSION');
            }
          },
          ['Discussion']
        ),
        h(
          'button',
          {
            class: 'header',
            key: 't1',
            onclick: () => {
              this.setTab('CHANGE_LOG');
            }
          },
          ['Changes']
        ),
        h(
          'button',
          {
            class: 'header',
            key: 't2',
            onclick: () => {
              this.setTab('ABOUT');
            }
          },
          ['About']
        )
      ]),
      h(
        'button',
        {
          class: 'header',
          key: 'window-close',
          onclick: this.props.toggleVisibility
        },
        ['x']
      )
    ]);
  }

  /**
   * Set tab.
   * @param {String} tab Tab identifier
   */
  setTab(tab) {
    this.setState({ tab: tab });
  }
}

Client.propTypes = {
  toggleVisibility: PropTypes.Function,
  visible: PropTypes.boolean
};

export default Client;
