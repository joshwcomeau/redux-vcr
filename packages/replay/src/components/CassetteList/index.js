import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { actionCreators, cassetteSelectors } from 'redux-vcr.shared';
import sampleWithProbability from '../../utils/sample-with-probability';
import cassetteThemes from '../../data/cassette-themes';
import cassetteOffsets from '../../data/cassette-offsets';
import Cassette from '../Cassette';
import Icon from '../Icon';
import './index.scss';

const {
  isFirstPageSelector,
  isLastPageSelector,
  paginatedCassetteListSelector,
} = cassetteSelectors;


class CassetteList extends Component {
  constructor(props) {
    super(props);

    this.animateCassetteSelection = this.animateCassetteSelection.bind(this);
    this.renderCassette = this.renderCassette.bind(this);

    // While the actual `selectedCassette` value lives in the redux store,
    // we want to animate the selection process. Therefore, we first set this
    // component's local state, base the animation off of it, and when it's
    // complete we dispatch the action to change the actual value.
    this.state = {
      selectedCassette: null,
    };
  }

  componentWillMount() {
    // Fetch an up-to-date list of the cassettes.
    this.props.cassettesListRequest();
  }

  animateCassetteSelection({ id }) {
    this.setState({
      selectedCassette: id,
    });

    setTimeout(() => {
      this.props.selectCassette({ id });
    }, 1000);
  }

  renderCassette(cassette) {
    const { selectedCassette } = this.state;
    const { id } = cassette;

    const classes = classNames({
      'cassette-wrapper': true,
      'fading-away': selectedCassette && selectedCassette !== id,
      'selected': selectedCassette === id,
    });

    return (
      <div key={id} className={classes}>
        <Cassette
          {...cassette}
          theme={sampleWithProbability(cassetteThemes, id)}
          offset={sampleWithProbability(cassetteOffsets, id)}
          handleClick={this.animateCassetteSelection}
        />
      </div>
    );
  }

  render() {
    const {
      cassettes,
      isFirstPage,
      isLastPage,
      goToNextCassettePage,
      goToPreviousCassettePage,
    } = this.props;

    const nextButtonClasses = classNames([
      'vcr-pagination-control',
      'next',
      { 'fade-away': !!this.state.selectedCassette },
    ]);

    const previousButtonClasses = classNames([
      'vcr-pagination-control',
      'previous',
      { 'fade-away': !!this.state.selectedCassette },
    ]);

    return (
      <div className="cassette-list">
        {cassettes.map(this.renderCassette)}

        <button
          className={previousButtonClasses}
          onClick={goToPreviousCassettePage}
          disabled={isFirstPage}
        >
          <Icon value="arrow_up" />
        </button>
        <button
          className={nextButtonClasses}
          onClick={goToNextCassettePage}
          disabled={isLastPage}
        >
          <Icon value="arrow_down" />
        </button>
      </div>
    );
  }
}

CassetteList.propTypes = {
  cassettes: PropTypes.array,
  isFirstPage: PropTypes.bool,
  isLastPage: PropTypes.bool,
  cassettesListRequest: PropTypes.func.isRequired,
  selectCassette: PropTypes.func.isRequired,
  goToNextCassettePage: PropTypes.func.isRequired,
  goToPreviousCassettePage: PropTypes.func.isRequired,
};

CassetteList.defaultProps = {
};

const mapStateToProps = state => {
  return {
    cassettes: paginatedCassetteListSelector(state),
    isFirstPage: isFirstPageSelector(state),
    isLastPage: isLastPageSelector(state),
  };
};

export { CassetteList };

export default connect(mapStateToProps, {
  cassettesListRequest: actionCreators.cassettesListRequest,
  selectCassette: actionCreators.selectCassette,
  goToNextCassettePage: actionCreators.goToNextCassettePage,
  goToPreviousCassettePage: actionCreators.goToPreviousCassettePage,
})(CassetteList);
