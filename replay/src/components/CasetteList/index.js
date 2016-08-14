import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as actionCreators from '../../../../shared/actions';
import {
  isFirstPageSelector,
  isLastPageSelector,
  paginatedCasetteListSelector,
} from '../../../../shared/reducers/casettes.reducer';

import Casette from '../Casette';
import Icon from '../Icon';
import './index.scss';


class CasetteList extends Component {
  constructor(props) {
    super(props);

    this.animateCasetteSelection = this.animateCasetteSelection.bind(this);
    this.renderCasette = this.renderCasette.bind(this);

    // While the actual `selectedCasette` value lives in the redux store,
    // we want to animate the selection process. Therefore, we first set this
    // component's local state, base the animation off of it, and when it's
    // complete we dispatch the action to change the actual value.
    this.state = {
      selectedCasette: null,
    };
  }

  animateCasetteSelection({ id }) {
    this.setState({
      selectedCasette: id,
    });

    window.setTimeout(() => {
      this.props.selectCasette({ id });
    }, 1000);
  }

  renderCasette(casette) {
    const { selectedCasette } = this.state;
    const { id } = casette;

    const classes = classNames({
      'casette-wrapper': true,
      'fading-away': selectedCasette && selectedCasette !== id,
      'selected': selectedCasette === id,
    });

    return (
      <div key={id} className={classes}>
        <Casette
          {...casette}
          handleClick={this.animateCasetteSelection}
        />
      </div>
    );
  }

  render() {
    const {
      casettes,
      isFirstPage,
      isLastPage,
      goToNextCasettePage,
      goToPreviousCasettePage,
    } = this.props;

    const previousButtonClasses = classNames([
      'vcr-pagination-control',
      'previous',
    ]);

    return (
      <div className="casette-list">
        {casettes.map(this.renderCasette)}

        <button
          className={previousButtonClasses}
          onClick={goToPreviousCasettePage}
          disabled={isFirstPage}
        >
          <Icon value="arrow_up" />
        </button>
        <button
          className="vcr-pagination-control next"
          onClick={goToNextCasettePage}
          disabled={isLastPage}
        >
          <Icon value="arrow_down" />
        </button>
      </div>
    );
  }
}

CasetteList.propTypes = {
  casettes: PropTypes.array,
  isFirstPage: PropTypes.bool,
  isLastPage: PropTypes.bool,
  selectCasette: PropTypes.func,
  goToNextCasettePage: PropTypes.func,
  goToPreviousCasettePage: PropTypes.func,
};

CasetteList.defaultProps = {
};

const mapStateToProps = state => {
  return {
    casettes: paginatedCasetteListSelector(state),
    isFirstPage: isFirstPageSelector(state),
    isLastPage: isLastPageSelector(state),
  };
};

export default connect(mapStateToProps, {
  selectCasette: actionCreators.selectCasette,
  goToNextCasettePage: actionCreators.goToNextCasettePage,
  goToPreviousCasettePage: actionCreators.goToPreviousCasettePage,
})(CasetteList);
