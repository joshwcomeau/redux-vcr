/* eslint-disable jsx-a11y/no-marquee */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { actionCreators } from 'redux-vcr.shared';
import VCRButton from '../VCRButton';
import VCRPowerLight from '../VCRPowerLight';
import './index.scss';


class VCR extends Component {
  renderScreen() {
    const { playStatus, cassetteStatus } = this.props;

    if (cassetteStatus === 'idle') {
      return (
        <div className="vcr-screen-contents">
          <div className="vcr-screen-idle">
            {/*
              Well, since this is a retro-themed devtool,
              why not go oldschool? >:D
              TODO: Replace this with a Marquee component?
            */}
            <marquee>Click to Select a Cassette</marquee>
          </div>
        </div>
      );
    } else if (cassetteStatus === 'selecting') {
      return (
        <div className="vcr-screen-contents">
          <div className="vcr-screen-selecting">Selecting...</div>
        </div>
      );
    }

    let labelText;
    switch (playStatus) {
      case 'playing': labelText = 'Now Playing'; break;
      case 'paused': labelText = 'Paused'; break;
      default: labelText = 'Selected'; break;
    }

    return (
      <div className="vcr-screen-contents">
        <div className="vcr-screen-label">{labelText}</div>
        <div className="vcr-screen-session-name">
          {this.props.selectedCassette}
        </div>
      </div>
    );
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

        <div className="vcr-screen" onClick={viewCassettes}>
          {this.renderScreen()}
        </div>

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
    );
  }
}

VCR.propTypes = {
  doorLabel: PropTypes.string,
  playStatus: PropTypes.string,
  cassetteStatus: PropTypes.string,
  selectedCassette: PropTypes.string,
  playbackSpeed: PropTypes.number,
  playCassette: PropTypes.func.isRequired,
  pauseCassette: PropTypes.func.isRequired,
  stopCassette: PropTypes.func.isRequired,
  viewCassettes: PropTypes.func.isRequired,
  ejectCassette: PropTypes.func.isRequired,
  changePlaybackSpeed: PropTypes.func.isRequired,
};

VCR.defaultProps = {
  doorLabel: 'HI-FI STEREO SYSTEM',
};

const mapStateToProps = state => ({
  playStatus: state.reduxVCR.play.status,
  cassetteStatus: state.reduxVCR.cassettes.status,
  selectedCassette: state.reduxVCR.cassettes.selected,
  playbackSpeed: state.reduxVCR.play.speed,
});


export default connect(mapStateToProps, {
  playCassette: actionCreators.playCassette,
  pauseCassette: actionCreators.pauseCassette,
  stopCassette: actionCreators.stopCassette,
  ejectCassette: actionCreators.ejectCassette,
  viewCassettes: actionCreators.viewCassettes,
  changePlaybackSpeed: actionCreators.changePlaybackSpeed,
})(VCR);
