import AnswerItem from './answer-item';
import AriaModal from 'react-aria-modal';
import ChangeItem from './change-item';
import ChangeList from './change-list';
import html2canvas from 'html2canvas';
import { Icon } from 'react-icons-kit';
import MessageItem from './message-item';
import PropTypes from 'prop-types';
import QuestionItem from './question-item';
import React from 'react';

import {camera} from 'react-icons-kit/entypo/camera';
import {edit} from 'react-icons-kit/entypo/edit';
import {eraser} from 'react-icons-kit/entypo/eraser';
import {landscape} from 'react-icons-kit/entypo/landscape';
import {text} from 'react-icons-kit/entypo/text';

import './styles.scss';

/**
 * Events viewer displays a single, time-ordered list of user comments, change
 * events, questions.
 */
class Events extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      message: '',
      modalActive: false,
      screenshot: null
    };
    // force function binding to class scope
    this.getScreenshot = this.getScreenshot.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  /**
   * Take a screenshot. Hide the launcher and client window temporarily, take
   * a screenshot then reset the view state.
   * @returns {Promise} Canvas with screenshot
   */
  getScreenshot () {
    let self = this;
    html2canvas(document.body).then((canvas) => {
      self.setState({screenshot: canvas});
    });
  }

  handleInputBlur () {
    // console.info('input blur');
  }

  handleInputFocus () {
    // console.info('input focus');
  }

  /**
   * Handle message input value change.
   * @param {Event} e Event
   */
  handleInputValueChange (e) {
    this.setState({message: e.target.value});
  }

  /**
   * Handle message received event.
   * @param {Object} msg Data
   */
  handleEventReceived (msg) {
    // console.log('received message', msg);
    let events = this.state.events.slice();
    events.push(msg);
    this.setState({events: events});
    this.scrollToLastEvent();
  }

  /**
   * Handle message submit.
   * @param {Event} event Event
   */
  handleMessageSubmit (event) {
    event.preventDefault();
    if (this.state.message !== '') {
      let msg = {
        fullname: this.props.user.fullname,
        message: this.state.message,
        user: this.props.user.uuid,
        url: window.location.href
      };
      this.props.socket.emit('discussion', msg);
      this.setState({message: ''});
    }
  }

  hideModal () {
    this.setState({screenshot: null, showModal: false});
  }

  /**
   * Render the component.
   * @returns {VNode<{class: string}>}
   */
  render () {
    let modal = this.state.screenshot !== null ? this.renderScreenshotModal() : '';
    let self = this;
    // FIXME terrible approach
    setTimeout(() => {
      self.scrollToLastEvent();
    });
    return (
      <div className={'body events'}>
        {this.renderEvents()}
        {this.renderFooter()}
        {modal}
      </div>
    );
  }

  /**
   * Render events.
   * @returns {XML}
   */
  renderEvents () {
    let events = this.props.events.map((m, i) => {
      if (m.type && m.type === 'ANSWER') {
        return (<AnswerItem data={m} key={m.uuid || i} />);
      } else if (m.type && m.type === 'CHANGE') {
        return (<ChangeItem data={m} key={m.uuid || i} />);
      } else if (m.type && m.type === 'CHANGE_LIST') {
        return (<ChangeList changes={m} expanded={false} key={m.uuid || i} />);
      } else if (m.type && m.type === 'MESSAGE') {
        return (<MessageItem data={m} key={m.uuid || i} />);
      } else if (m.type && m.type === 'QUESTION') {
        return (<QuestionItem data={m} key={m.uuid || i} />);
      }
    });
    return (<div className={'events scrollable'}>{events}</div>);
  }

  /**
   * Render footer.
   * @returns {XML}
   */
  renderFooter () {
    return (
      <div className={'footer'}>
        <form onSubmit={this.handleMessageSubmit}>
          <input autoComplete={'off'}
            onChange={this.handleInputValueChange}
            placeholder={'Leave a message'}
            type={'text'}
            value={this.state.message} />
        </form>
        {/* <Icon className={'control screenshot'} icon={camera} onClick={this.getScreenshot} title={'Attach a screenshot'}/> */}
      </div>
    );
  }

  /**
   * Render screenshot modal dialog.
   * @returns {XML}
   */
  renderScreenshotModal () {
    let self = this;
    setTimeout(() => {
      let el = document.getElementById('screenshot-preview');
      // rescale the image to fit the preview area
      let canvas = self.state.screenshot;
      // let scaleFactor = el.clientWidth / canvas.width;
      // canvas.width = Math.floor(el.clientWidth * scaleFactor);
      // canvas.height = Math.floor(canvas.height * scaleFactor);
      el.appendChild(canvas);
    }, 50);
    return (
      <AriaModal onExit={this.hideModal} titleText={'Screenshot'}>
        <div className="hotpot-modal screenshot">
          <div className="modal-body">
            <div className={'preview'} id="screenshot-preview"></div>
            <div className={'sidebar'}>
              <div className={'tools'}>
                <Icon className={'tool'} icon={edit} size={24} title={'Line'} />
                <Icon className={'tool'} icon={eraser} size={24} title={'Erase'} />
                <Icon className={'tool'} icon={text} size={24} title={'Text'} />
                <Icon className={'tool'} icon={landscape} size={24} title={'Rectangle'} />
              </div>
              <div className={'inset'}>
                <div className={'comment'}>Text feedback here</div>
              </div>
              <div className={'controls'}>
                <button className={'cancel'} onClick={this.hideModal}>Cancel</button>
                <button className={'send'} onClick={this.hideModal}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </AriaModal>
    );
  }

  /**
   * Scroll the panel to the last event.
   */
  scrollToLastEvent () {
    let els = document.querySelectorAll('.hotpot.app .client .event');
    let lastEvent = els[els.length - 1];
    if (lastEvent) {
      lastEvent.scrollIntoView();
    }
  }

  showModal () {
    this.setState({showModal: true});
  }
}

Events.propTypes = {
  events: PropTypes.array,
  socket: PropTypes.object,
  user: PropTypes.object,
  visible: PropTypes.bool
};

export default Events;
