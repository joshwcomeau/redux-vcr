/* eslint-disable jsx-a11y/no-marquee */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';

// import { actionCreators } from 'redux-vcr.shared';
import { actionCreators } from '../../../../shared/src';
import VCRButton from '../VCRButton';
import VCRPowerLight from '../VCRPowerLight';
import VCRScreen from '../VCRScreen';
import './index.scss';


class VCR extends Component {
  getScreenLabel() {
    const { cassetteStatus, playStatus } = this.props;
    if (cassetteStatus !== 'loaded') {
      return '';
    }
    switch (playStatus) {
      case 'playing': return 'Now Playing';
      case 'paused': return 'Paused';
      default: return 'Selected';
    }
  }

  getScreenContents() {
    const {
      isLoggedIn,
      hasAuthError,
      cassetteStatus,
      selectedCassette,
    } = this.props;

    if (hasAuthError) {
      return 'ERROR. See console for details.';
    }

    if (!isLoggedIn) {
      return 'Click to authenticate with GitHub';
    }

    switch (cassetteStatus) {
      case 'idle': return 'Click to select a cassette';
      case 'selecting': return 'Selecting...';
      default: return selectedCassette;
    }
  }

  getScreenEffect() {
    const { isLoggedIn, hasAuthError, cassetteStatus } = this.props;

    if (hasAuthError) {
      return 'flashing';
    } else if (!isLoggedIn || cassetteStatus === 'idle') {
      return 'scrolling';
    }
  }

  getVCRClickHandler() {
    if (!this.props.isLoggedIn) {
      return () => this.props.signInRequest({ authMethod: 'github' });
    }

    return this.props.viewCassettes;
  }

  render() {
    const {
      doorLabel,
      playStatus,
      cassetteStatus,
      playbackSpeed,
      hasAuthError,
      playCassette,
      pauseCassette,
      stopCassette,
      viewCassettes,
      ejectCassette,
      changePlaybackSpeed,
    } = this.props;

    const doorOpen = cassetteStatus === 'selecting';

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
          <div
            className={`cassette-slot-door ${doorOpen ? 'is-open' : ''}`}
          >
            <span className="cassette-slot-door-label">
              {doorLabel}
            </span>
          </div>
          <div className="cassette-slot" onClick={viewCassettes} />

          <VCRScreen
            label={this.getScreenLabel()}
            textColor={hasAuthError ? 'red' : 'green'}
            effect={this.getScreenEffect()}
            onClick={this.getVCRClickHandler()}
          >
            {this.getScreenContents()}
          </VCRScreen>

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
              onClick={() => changePlaybackSpeed(0.5)}
              toggleable
              toggled={playbackSpeed === 0.5}
            >
              .5x
            </VCRButton>
            <VCRButton
              className="speed-normal"
              onClick={() => changePlaybackSpeed(1)}
              toggleable
              toggled={playbackSpeed === 1}
            >
              1x
            </VCRButton>
            <VCRButton
              className="speed-double"
              onClick={() => changePlaybackSpeed(2)}
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
  hasAuthError: PropTypes.bool.isRequired,
  playCassette: PropTypes.func.isRequired,
  pauseCassette: PropTypes.func.isRequired,
  stopCassette: PropTypes.func.isRequired,
  viewCassettes: PropTypes.func.isRequired,
  ejectCassette: PropTypes.func.isRequired,
  changePlaybackSpeed: PropTypes.func.isRequired,
  signInRequest: PropTypes.func.isRequired,
};

VCR.defaultProps = {
  doorLabel: 'HI-FI STEREO SYSTEM',
};

const mapStateToProps = state => ({
  playStatus: state.reduxVCR.play.status,
  cassetteStatus: state.reduxVCR.cassettes.status,
  selectedCassette: state.reduxVCR.cassettes.selected,
  playbackSpeed: state.reduxVCR.play.speed,
  isLoggedIn: state.reduxVCR.authentication.loggedIn,
  hasAuthError: !!state.reduxVCR.authentication.error,
});

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
