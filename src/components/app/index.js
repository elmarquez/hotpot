import Client from '../client/index';
import Launcher from '../launcher/index';
import React from 'react';
import './styles.scss';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      client: false,
      launcher: true
    };
  }

  /**
   * Render the component.
   * @returns {VNode<{class: string}>}
   */
  render () {
    return (
      <div className={'app'}>
        <Launcher toggleVisibility={this.toggleClientVisibility} visible={this.state.launcher} />
        <Client toggleVisibility={this.toggleClientVisibility} visible={this.state.client} />
      </div>
    );
  }

  toggleClientVisibility = () => {
    this.setState({ client: !this.state.client });
  };
}

export default App;
