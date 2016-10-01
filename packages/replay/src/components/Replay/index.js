import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FlipMove from 'react-flip-move';

import { actionCreators } from 'redux-vcr.shared';
import VCR from '../VCR';
import CassetteList from '../CassetteList';
import Backdrop from '../Backdrop';

import './index.scss';

const cassetteListAnimation = {
  enter: {
    from: {
      transform: 'translateY(50px)',
      opacity: 0.01,
    },
    to: {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  leave: {
    from: {
      transform: 'translateY(8px)',
      opacity: 1,
    },
    to: {
      transform: 'translateY(50px)',
      opacity: 0.01,
    },
  },
};

class Replay extends Component {
  componentDidMount() {
    const { requiresAuth, cassettesListRequest } = this.props;

    // If we don't need to authenticate, we want to request our
    // initial cassette list ASAP!
    if (!requiresAuth) {
      cassettesListRequest();
    }
  }

  render() {
    const {
      doorLabel,
      cassettesBackdropColor,
      cassettesBackdropOpacity,
      cassetteStatus,
      hideCassettes,
    } = this.props;

    return (
      <div className="redux-vcr-component">
        <VCR doorLabel={doorLabel} />

        <FlipMove
          enterAnimation={cassetteListAnimation.enter}
          leaveAnimation={cassetteListAnimation.leave}
        >
          { cassetteStatus === 'selecting' ? <CassetteList /> : null }
        </FlipMove>

        <Backdrop
          isShown={cassetteStatus === 'selecting'}
          handleClickClose={hideCassettes}
          background={cassettesBackdropColor}
          opacity={cassettesBackdropOpacity}
        />
      </div>
    );
  }
}


Replay.propTypes = {
  doorLabel: PropTypes.string,
  cassettesBackdropColor: PropTypes.string,
  cassettesBackdropOpacity: PropTypes.number,
  cassetteStatus: PropTypes.string.isRequired,
  requiresAuth: PropTypes.bool,
  hideCassettes: PropTypes.func,
  cassettesListRequest: PropTypes.func,
};

Replay.defaultProps = {
  cassettesBackdropColor: '#FFF',
  cassettesBackdropOpacity: 0.9,
};

const mapStateToProps = state => ({
  cassetteStatus: state.reduxVCR.cassettes.status,
  requiresAuth: state.reduxVCR.authentication.requiresAuth,
});


export default connect(
  mapStateToProps,
  {
    hideCassettes: actionCreators.hideCassettes,
    cassettesListRequest: actionCreators.cassettesListRequest,
  }
)(Replay);
