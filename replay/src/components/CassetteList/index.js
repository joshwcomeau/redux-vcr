import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as actionCreators from '../../../../shared/lib/actions';
import {
  isFirstPageSelector,
  isLastPageSelector,
  paginatedCassetteListSelector,
} from '../../../../shared/lib/reducers/cassettes.reducer';

import Cassette from '../Cassette';
import Icon from '../Icon';
import './index.scss';


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

  animateCassetteSelection({ id }) {
    this.setState({
      selectedCassette: id,
    });

    window.setTimeout(() => {
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

    const previousButtonClasses = classNames([
      'vcr-pagination-control',
      'previous',
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
          className="vcr-pagination-control next"
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
  selectCassette: PropTypes.func,
  goToNextCassettePage: PropTypes.func,
  goToPreviousCassettePage: PropTypes.func,
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

export default connect(mapStateToProps, {
  selectCassette: actionCreators.selectCassette,
  goToNextCassettePage: actionCreators.goToNextCassettePage,
  goToPreviousCassettePage: actionCreators.goToPreviousCassettePage,
})(CassetteList);
