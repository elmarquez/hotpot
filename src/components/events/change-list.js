import ChangeItem from './change-item';
import { Icon } from 'react-icons-kit';
import PropTypes from 'prop-types';
import React from 'react';

import {smalldown} from 'react-icons-kit/entypo/smallDown';
import {smallup} from 'react-icons-kit/entypo/smallUp';

import './styles.scss';

/**
 * A sequence of repository changes (ie. commits), presented in an expander.
 */
class ChangeList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      expanded: this.props.expanded || false
    };
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  /**
   * Render component.
   * @returns {XML}
   */
  render () {
    return (
      <div className={'event changes'} key={this.props.key}>
        <div className={'title'}>
          Changes ({this.props.changes.length} commits)
          {this.renderExpander()}
        </div>
        {this.renderCommits()}
      </div>
    );
  }

  /**
   * Render commit.
   * @param {Object} c Commit data
   * @param {String} key Key
   * @returns {XML}
   */
  renderCommit (c, key) {
    return (<ChangeItem data={c} key={key}/>);
  }

  /**
   * Render commits.
   * @returns {XML}
   */
  renderCommits () {
    if (this.state.expanded) {
      let self = this;
      return this.props.changes.map((c, i) => self.renderCommit(c, i)).join('');
    }
  }

  /**
   * Render expander toggle control.
   * @returns {XML}
   */
  renderExpander () {
    if (this.state.expanded) {
      return (<Icon icon={smalldown} onClick={this.toggleExpanded} size={16}/>);
    } else {
      return (<Icon icon={smallup} onClick={this.toggleExpanded} size={16}/>);
    }
  }

  toggleExpanded () {
    this.setState({expanded: !this.state.expanded});
  }
}

ChangeList.propTypes = {
  changes: PropTypes.array,
  expanded: PropTypes.bool,
  key: PropTypes.string
};

export default ChangeList;
