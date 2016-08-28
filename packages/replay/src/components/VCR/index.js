/* eslint-disable jsx-a11y/no-marquee */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';

import { actionCreators } from 'redux-vcr.shared';
import VCRButton from '../VCRButton';
import VCRPowerLight from '../VCRPowerLight';
import VCRScreen from '../VCRScreen';
import VCRDoor from '../VCRDoor';
import './index.scss';


class VCR extends Component {
  constructor(props) {
    super(props);

    this.signIn = props.signInRequest.bind(null, { authMethod: 'github.com' });
    this.handleVCRClick = this.handleVCRClick.bind(this);
  }

  handleVCRClick() {
    const { isLoggedIn, requiresAuth, viewCassettes } = this.props;

    return (!isLoggedIn && requiresAuth) ? this.signIn() : viewCassettes();
  }

  render() {
    const {
      doorLabel,
      playStatus,
      cassetteStatus,
      playbackSpeed,
      playCassette,
      pauseCassette,
      stopCassette,
      ejectCassette,
      changePlaybackSpeed,
    } = this.props;

    let playPauseAction;
    if (cassetteStatus !== 'loaded') {
      playPauseAction = () => {};
    } else if (playStatus === 'playing') {
      playPauseAction = pauseCassette;
    } else {
      playPauseAction = playCassette;
    }

    return (
      <Draggable>
        <div className="vcr">
          <div className="vcr-top" />
          <div className="vcr-bg" />
          <VCRButton
            className="eject-button"
            onClick={ejectCassette}
            iconValue="eject"
            iconSize={16}
          />

          <VCRDoor
            label={doorLabel}
            isOpen={cassetteStatus === 'selecting'}
            onClick={this.handleVCRClick}
          />

          <VCRScreen onClick={this.handleVCRClick} />

          <div className="primary-action-buttons">
            <VCRButton
              className="play-pause-button"
              onClick={playPauseAction}
              iconValue={playStatus === 'playing' ? 'pause' : 'play'}
              iconSize={20}
              glowing={cassetteStatus === 'loaded' && playStatus === 'stopped'}
            />
            <VCRButton
              className="stop-button"
              onClick={stopCassette}
              iconValue={'stop'}
              iconSize={20}
              glowing={playStatus === 'playing' || playStatus === 'paused'}
            />
          </div>

          <div className="secondary-action-buttons">
            <VCRButton
              className="speed-half"
              onClick={() => changePlaybackSpeed({ playbackSpeed: 0.5 })}
              toggleable
              toggled={playbackSpeed === 0.5}
            >
              .5x
            </VCRButton>
            <VCRButton
              className="speed-normal"
              onClick={() => changePlaybackSpeed({ playbackSpeed: 1 })}
              toggleable
              toggled={playbackSpeed === 1}
            >
              1x
            </VCRButton>
            <VCRButton
              className="speed-double"
              onClick={() => changePlaybackSpeed({ playbackSpeed: 2 })}
              toggleable
              toggled={playbackSpeed === 2}
            >
              2x
            </VCRButton>
          </div>

          <div className="decorative-outputs">
            <div className="decorative-output yellow" />
            <div className="decorative-output white" />
            <div className="decorative-output red" />
          </div>

          <VCRPowerLight mode={playStatus} />

          <div className="vcr-foot vcr-foot-left" />
          <div className="vcr-foot vcr-foot-right" />
        </div>
      </Draggable>
    );
  }
}

VCR.propTypes = {
  doorLabel: PropTypes.string,
  playStatus: PropTypes.string,
  cassetteStatus: PropTypes.string,
  selectedCassette: PropTypes.string,
  playbackSpeed: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  requiresAuth: PropTypes.bool.isRequired,
  hasAuthError: PropTypes.bool.isRequired,
  playCassette: PropTypes.func.isRequired,
  pauseCassette: PropTypes.func.isRequired,
  stopCassette: PropTypes.func.isRequired,
  viewCassettes: PropTypes.func.isRequired,
  ejectCassette: PropTypes.func.isRequired,
  changePlaybackSpeed: PropTypes.func.isRequired,
  signInRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  // In test environment, just return a blank object.
  if (process.env.NODE_ENV === 'test') {
    return {};
  }

  return {
    playStatus: state.reduxVCR.play.status,
    cassetteStatus: state.reduxVCR.cassettes.status,
    selectedCassette: state.reduxVCR.cassettes.selected,
    playbackSpeed: state.reduxVCR.play.speed,
    isLoggedIn: state.reduxVCR.authentication.loggedIn,
    requiresAuth: state.reduxVCR.authentication.requiresAuth,
    hasAuthError: !!state.reduxVCR.authentication.error,
  };
};

export { VCR };

export default connect(mapStateToProps, {
  playCassette: actionCreators.playCassette,
  pauseCassette: actionCreators.pauseCassette,
  stopCassette: actionCreators.stopCassette,
  ejectCassette: actionCreators.ejectCassette,
  viewCassettes: actionCreators.viewCassettes,
  changePlaybackSpeed: actionCreators.changePlaybackSpeed,
  signInRequest: actionCreators.signInRequest,
})(VCR);
