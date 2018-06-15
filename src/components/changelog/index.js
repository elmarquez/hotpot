import { h } from 'hyperapp';
import './styles.scss';

/**
 * Render the component view.
 * @param {Object} state Parent component state
 * @param {Object} actions Parent component actions
 */
function view (state, actions) {
  let commits = state.changelog.map(c => {
    return h('li', {class:'commit'}, ['Sample commit message']);
  });
  return h('div', {class:'changelog'}, [
    h('div', {class:'header'}, ['Change Log']),
    h('div', {class:'body'}, [
      h('ul', {class:'changes'}, commits)
    ])
  ]);
}

module.exports = {
  view: view
};
