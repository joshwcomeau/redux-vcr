import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { actionCreators } from 'redux-vcr.shared';
import VCR from '../VCR';
import CassetteList from '../CassetteList';
import Backdrop from '../Backdrop';

import './index.scss';


const Replay = ({
  doorLabel,
  cassettesBackdropColor,
  cassettesBackdropOpacity,
  cassetteStatus,
  hideCassettes,
}) => (
  <div className="redux-vcr-component">
    <VCR doorLabel={doorLabel} />

    { cassetteStatus === 'selecting' ? <CassetteList /> : null }

    <Backdrop
      isShown={cassetteStatus === 'selecting'}
      handleClickClose={hideCassettes}
      background={cassettesBackdropColor}
      opacity={cassettesBackdropOpacity}
    />
  </div>
);


Replay.propTypes = {
  doorLabel: PropTypes.string,
  cassettesBackdropColor: PropTypes.string,
  cassettesBackdropOpacity: PropTypes.number,
  cassetteStatus: PropTypes.string.isRequired,
  hideCassettes: PropTypes.func,
};

Replay.defaultProps = {
  cassettesBackdropColor: '#FFF',
  cassettesBackdropOpacity: 0.9,
};

const mapStateToProps = state => ({
  cassetteStatus: state.reduxVCR.cassettes.status,
});


export default connect(
  mapStateToProps,
  {
    hideCassettes: actionCreators.hideCassettes,
  }
)(Replay);
