import { h, Component } from 'preact';
import Client from '../client/index';
import Launcher from '../launcher/index';
import postal from 'postal';
import './styles.scss';

class App extends Component {
  constructor(props) {
    super(props);
    const config = {
      callback: () => this.toggleClientVisibility(),
      channel: 'app',
      topic: 'toggleClientVisibility'
    };
    this.state = {
      client: false,
      launcher: true,
      subscriptions: {
        visibility: postal.subscribe(config)
      }
    };
  }

  componentDidMount() {
    console.info('app component mounted');
  }

  /**
   * Render the component.
   * @param {Object} props Properties
   * @param {Object} state State
   * @returns {VNode<{class: string}>}
   */
  render(props, state) {
    return (
      <div className="app">
        <Launcher visible={this.state.launcher} />
        <Client visible={this.state.client} />
      </div>
    );
  }

  toggleClientVisibility(props, state) {
    this.setState({ client: !this.state.client });
  }
}

export default App;
