import axios from 'axios';
import posed from 'react-pose';
import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

/**
 * Single feedback message input window.
 */
class Feedback extends React.Component {
  constructor (props) {
    super(props);
    this.feedbackDiv = posed.div({
      hidden: {bottom: 0, right: 20, opacity: 0, transition: '1s all ease-in-out'},
      visible: {bottom: 90, right: 20, opacity: 1, transition: '1s all ease-in-out'}
    });
    this.state = {message: ''};
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
  }

  /**
   * Handle component mounted life cycle event.
   */
  componentDidMount () {
    const self = this;
    setTimeout(() => {
      self.setState({visible: true});
    }, 200);
  }

  /**
   * Handle form submit.
   * @param {Event} e Event
   */
  handleFormSubmit (e) {
    let self = this;
    let base = self.props.base;
    let data = {
      data: {},
      user: self.props.user
    };
    axios
      .post(`/messages`, data)
      .then(res => {
        console.log('succeeded');
        self.setState({message:e.target.value});
      })
      .catch(err => {
        console.log('failed');
      });
  }

  /**
   * Handle text input change.
   * @param {Event} e Event
   */
  handleTextInputChange (e) {
    this.setState({message:e.target.value});
  }

  /**
   * Render the component.
   * @returns {XML}
   */
  render () {
    let FeedbackClient = this.feedbackDiv;
    return (
      <FeedbackClient className={'feedback'} pose={this.props.visible ? 'visible' : 'hidden'}>
        {this.renderHeader()}
        {this.renderBody()}
      </FeedbackClient>
    );
  }

  /**
   * Render body.
   * @returns {XML}
   */
  renderBody () {
    return (
      <div className={'body'}>
        <form onSubmit={this.handleFormSubmit}>
          <textarea onChange={this.handleTextInputChange} placeholder={'Enter your message'} value={this.state.message}></textarea>
          <button type={'submit'}>Submit</button>
        </form>
      </div>
    );
  }

  /**
   * Render header.
   * @returns {XML}
   */
  renderHeader () {
    return (
      <div className={'header'}>
        <div className={'inset'}>
          Thanks for visiting! We’re away right now but if you have a suggestion,
          feel free to leave a message and we&apos;ll get back to you soon!
        </div>
      </div>
    );
  }
}

Feedback.propTypes = {
  title: PropTypes.string,
  user: PropTypes.object
};

export default Feedback;
