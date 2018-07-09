import { h, Component } from 'preact';
import Client from '../client/index';
import Launcher from '../launcher/index';
import './styles.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: false,
      launcher: true
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
    console.log(props, state);
    return (
      <div className={'app'}>
        <Launcher
          key={'launcher'}
          toggleVisibility={this.toggleClientVisibility}
          visible={this.state.launcher}
        />
        <Client
          key={'client'}
          toggleVisibility={this.toggleClientVisibility}
          visible={this.state.client}
        />
      </div>
    );
  }

  toggleClientVisibility = (props, state) => {
    console.log('toggle client visibility');
    this.setState({ client: !this.state.client });
  };
}

export default App;
