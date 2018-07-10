import { h, Component } from 'preact';
import { PropTypes } from 'preact-compat';
import axios from 'axios';
import moment from 'moment';
import './styles.scss';

class ChangeLog extends Component {
  constructor(props, state) {
    super(props);
    this.state = {
      messages: []
    };
  }

  /**
   * Get the initial set of change log messages.
   * @returns {Promise}
   */
  getChangeLog() {
    let self = this;
    return axios.get('/changes').then(res => {
      self.setState({ messages: res.data });
      this.scrollToLatestMessage();
    });
  }

  // /**
  //  * Render the component.
  //  * @param {Object} props Properties
  //  * @param {Object} state Component state
  //  * @returns {VNode<{class: string}>}
  //  */
  // render(props, state) {
  //   if (this.props.visible) {
  //     return (
  //       <div className={'client'}>
  //         <div className={'header'}>
  //           {this.renderHeader()}
  //         </div>
  //         <div className={'body'} id={'client-body'}>
  //           {this.renderMessages()}
  //         </div>
  //         <div className={'footer'}>&nbsp;</div>
  //       </div>
  //     );
  //   } else {
  //     return h('div', { class: 'client hidden' }, []);
  //   }
  // }

  render(props, state) {
    return h('div', { class: 'changelog' }, ['Change log panel']);
  }

  renderChanges() {
    let changes = this.state.messages.map(m => {
      return h('div', { class: 'change', id: m.uuid }, [
        h('div', { class: 'meta' }, [
          h('span', { class: 'fullname' }, m.fullname),
          h(
            'span',
            { class: 'datetime' },
            moment(m.createdAt).format('MMM D, h:mm')
          )
        ]),
        h('span', { class: 'body' }, m.message)
      ]);
    });
    return h('div', { class: 'changes' }, changes);
  }

  /**
   * Render messages.
   * @returns {JSX.Element}
   */
  renderMessages() {
    let changes = this.state.messages.map(m => {
      return h('div', { class: 'change', id: m.uuid }, [
        h('div', { class: 'meta' }, [
          h('span', { class: 'fullname' }, m.fullname),
          h(
            'span',
            { class: 'datetime' },
            moment(m.createdAt).format('MMM D, h:mm')
          )
        ]),
        h('span', { class: 'body' }, m.message)
      ]);
    });
    return h('div', { class: 'changes' }, changes);
  }

  scrollToLatestMessage() {
    let div = document.getElementById('client-body');
    if (div) {
      div.scrollTop = div.scrollHeight;
    }
  }
}

ChangeLog.propTypes = {
  visible: PropTypes.boolean
};

export default ChangeLog;
