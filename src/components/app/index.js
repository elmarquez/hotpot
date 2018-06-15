import { h, Component } from 'preact';
import Client from "components/client/index";
import Launcher from "components/launcher/index";
import postal from 'postal';
import styles from './styles.scss';

class App extends Component {

  constructor(props) {
    super(props);
    var visibility = postal.subscribe({channel:'app', topic:'toggleClientVisibility', callback: () => {
      this.toggleClientVisibility();
    }});
    this.state = {
      client: false,
      launcher: true,
      subscriptions: {
        visibility: visibility
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
  render (props, state) {
    return (
      <div className={styles.app}>
        <Launcher visible={this.state.launcher}/>
        <Client visible={this.state.client} />
      </div>
    );
  }

  toggleClientVisibility (props, state) {
    this.setState({client: !this.state.client});
  }

}

export default App;
