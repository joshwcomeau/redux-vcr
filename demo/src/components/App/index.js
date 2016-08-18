import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { Replay } from 'redux-vcr.replay';
import Replay from '../../../../replay/src/components/Replay';


import { selectAnswer } from '../../actions';
import { getAnswers } from '../../reducers/answers.reducer';
import Button from '../Button';
import DevTools from '../DevTools';

import './index.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.clickButton = this.clickButton.bind(this);
  }

  clickButton(ev) {
    const buttonId = ev.target.value;
    this.props.selectAnswer({ id: buttonId });
  }

  renderButtons() {
    const { answers, selected } = this.props;

    return answers.map(({ id, name }) => (
      <Button
        key={id}
        value={id}
        toggled={selected === id}
        onClick={this.clickButton}
      >
        {name}
      </Button>
    ));
  }
  render() {
    return (
      <div className="App">
        <header>
          <h2>Who would you like to see become the next US President?</h2>
        </header>

        <section className="main-content">
          {this.renderButtons()}
        </section>

        <DevTools />
        <Replay />
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
  selectAnswer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  answers: getAnswers(state.answers),
  selected: state.answers.selected,
});

export default connect(mapStateToProps, { selectAnswer })(App);
