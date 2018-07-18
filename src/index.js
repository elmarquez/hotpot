import App from './app';
import ReactHabitat from 'react-habitat';

class HabitatApp extends ReactHabitat.Bootstrapper {
  constructor () {
    super();
    const containerBuilder = new ReactHabitat.ContainerBuilder();
    containerBuilder.register(App).as('hotpot');
    this.setContainer(containerBuilder.build());
  }
}

const instance = new HabitatApp();

window.updateHabitat = instance.update.bind(instance);

export default instance;
