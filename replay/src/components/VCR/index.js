/* eslint-disable jsx-a11y/no-marquee */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as actionCreators from '../../../../shared/actions';
import VCRButton from '../VCRButton';
import VCRPowerLight from '../VCRPowerLight';
import './index.scss';


class VCR extends Component {
  renderScreen() {
    const { playStatus, casetteStatus } = this.props;

    if (casetteStatus === 'idle') {
      return (
        <div className="vcr-screen-contents">
          <div className="vcr-screen-idle">
            {/*
              Well, since this is a retro-themed devtool,
              why not go oldschool? >:D
              TODO: Replace this with a Marquee component?
            */}
            <marquee>Click to Select a Casette</marquee>
          </div>
        </div>
      );
    } else if (casetteStatus === 'selecting') {
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
          {this.props.selectedCasette}
        </div>
      </div>
    );
  }

  render() {
    const {
      doorLabel,
      playStatus,
      casetteStatus,
      playbackSpeed,
      playCasette,
      pauseCasette,
      stopCasette,
      viewCasettes,
      ejectCasette,
      changePlaybackSpeed,
    } = this.props;

    const doorOpen = casetteStatus === 'selecting';

    let playPauseAction;
    if (casetteStatus !== 'loaded') {
      playPauseAction = () => {};
    } else if (playStatus === 'playing') {
      playPauseAction = pauseCasette;
    } else {
      playPauseAction = playCasette;
    }

    return (
      <div className="vcr">

        <div className="vcr-top" />
        <div className="vcr-bg" />
        <VCRButton
          className="eject-button"
          onClick={ejectCasette}
          iconValue="eject"
          iconSize={16}
        />
        <div
          className={`casette-slot-door ${doorOpen ? 'is-open' : ''}`}
        >
          <span className="casette-slot-door-label">
            {doorLabel}
          </span>
        </div>
        <div className="casette-slot" onClick={viewCasettes} />

        <div className="vcr-screen" onClick={viewCasettes}>
          {this.renderScreen()}
        </div>

        <div className="primary-action-buttons">
          <VCRButton
            className="play-pause-button"
            onClick={playPauseAction}
            iconValue={playStatus === 'playing' ? 'pause' : 'play'}
            iconSize={20}
            glowing={casetteStatus === 'loaded' && playStatus === 'stopped'}
          />
          <VCRButton
            className="stop-button"
            onClick={stopCasette}
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
  casetteStatus: PropTypes.string,
  selectedCasette: PropTypes.string,
  playbackSpeed: PropTypes.number,
  playCasette: PropTypes.func.isRequired,
  pauseCasette: PropTypes.func.isRequired,
  stopCasette: PropTypes.func.isRequired,
  viewCasettes: PropTypes.func.isRequired,
  ejectCasette: PropTypes.func.isRequired,
  changePlaybackSpeed: PropTypes.func.isRequired,
};

VCR.defaultProps = {
  doorLabel: 'HI-FI STEREO SYSTEM',
};

const mapStateToProps = state => ({
  playStatus: state.reduxVCR.play.status,
  casetteStatus: state.reduxVCR.casettes.status,
  selectedCasette: state.reduxVCR.casettes.selected,
  playbackSpeed: state.reduxVCR.play.speed,
});


export default connect(mapStateToProps, {
  playCasette: actionCreators.playCasette,
  pauseCasette: actionCreators.pauseCasette,
  stopCasette: actionCreators.stopCasette,
  ejectCasette: actionCreators.ejectCasette,
  viewCasettes: actionCreators.viewCasettes,
  changePlaybackSpeed: actionCreators.changePlaybackSpeed,
})(VCR);
