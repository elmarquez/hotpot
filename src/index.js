import habitat from 'preact-habitat';
import Widget from './components/app';

function init() {
  let widget = habitat(Widget);
  widget.render({
    inline: true,
    clean: false
  });
}

// in development, set up HMR:
if (module.hot) {
  require('preact/devtools'); // enables React DevTools, be careful on IE
  module.hot.accept('./components/app', function() {
    requestAnimationFrame(init);
  });
}

init();
