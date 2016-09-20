import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Replay } from 'redux-vcr.replay';

import { selectAnswer, completeOnboarding } from '../../actions';
import { getAnswers } from '../../reducers/answers.reducer';
import Onboarding from '../Onboarding';
import PollQuestion from '../PollQuestion';
import DevTools from '../DevTools';

import './index.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(ev) {
    const buttonId = ev.target.value;
    this.props.selectAnswer({ id: buttonId });
  }

  render() {
    return (
      <div className="App">
        {!this.props.hasCompletedOnboarding ? (
          <Onboarding
            completeOnboarding={this.props.completeOnboarding}
          />
        ) : (
          <PollQuestion
            answers={this.props.answers}
            selected={this.props.selected}
            handleClick={this.handleClick}
          />
        )}
        <Replay />
        <DevTools />
      </div>
    );
  }
}

App.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })),
  selected: PropTypes.string,
  hasCompletedOnboarding: PropTypes.bool,
  selectAnswer: PropTypes.func.isRequired,
  completeOnboarding: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  answers: getAnswers(state.answers),
  selected: state.answers.selected,
  hasCompletedOnboarding: state.onboarding.completed,
});


export default connect(
  mapStateToProps,
  { selectAnswer, completeOnboarding }
)(App);
