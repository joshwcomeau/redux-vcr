import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './index.scss';


class VCRScreen extends Component {
  getScreenLabel() {
    switch (this.props.screenMode) {
      case 'loaded': return 'Selected';
      case 'playing': return 'Playing';
      case 'paused': return 'Paused';
      default: return '';
    }
  }

  getScreenEffects() {
    switch (this.props.screenMode) {
      case 'error':
        return ['flashing', 'centered'];
      case 'unauthenticated':
        return ['scrolling', 'centered'];
      case 'idle':
      case 'selecting':
        return ['centered'];
      default:
        return [];
    }
  }

  getScreenContents() {
    switch (this.props.screenMode) {
      case 'error':
        return 'ERROR. See console for details.';
      case 'unauthenticated':
        return 'Click to authenticate with GitHub';
      case 'idle':
        return 'Click to select a cassette';
      case 'selecting':
        return 'Selecting...';
      case 'loaded':
        return this.props.selectedCassetteId;
      default:
        // TODO: Scrubber
        return this.props.selectedCassetteId;
    }
  }

  render() {
    const { screenMode, onClick } = this.props;

    const textColor = screenMode === 'error' ? 'red' : 'green';
    const label = this.getScreenLabel();
    const effects = this.getScreenEffects();
    const contents = this.getScreenContents();

    const bufferClasses = classNames('vcr-screen-buffer', {
      vertical: effects.includes('scrolling'),
    });
    const contentsClasses = classNames([
      'vcr-screen-contents',
      textColor,
      ...effects,
      // If we've supplied a label, we need to make space for it by
      // edging our main content down a bit.
      { 'edged-down': !!label },
    ]);

    return (
      <div className="vcr-screen" onClick={onClick}>
        <div className={bufferClasses}>
          <div className="vcr-screen-label">{label}</div>
          <div className={contentsClasses}>
            {contents}
          </div>
        </div>
      </div>
    );
  }
}

VCRScreen.propTypes = {
  screenMode: PropTypes.oneOf([
    'error',
    'unauthenticated',
    'idle',
    'selecting',
    'loaded',
    'playing',
    'paused',
  ]).isRequired,
  selectedCassetteId: PropTypes.string,
  numOfActions: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

VCRScreen.defaultProps = {
  textColor: 'green',
  effects: [],
};

const mapStateToProps = state => {
  if (process.env.NODE_ENV === 'test') {
    return {};
  }
  // Our VCR screen is capable of displaying a ton of different stuff,
  // depending on our state. Initially I was going to use selectors in
  // the reducer files, but they span multiple concerns.
  //
  // If performance is a problem, consider memoizing these computations.
  const {
    reduxVCR: {
      cassettes: {
        status: cassetteStatus,
        selected: selectedCassetteId,
        byId: cassettesById,
      },
      play: {
        status: playStatus,
      },
      authentication: {
        loggedIn: isLoggedIn,
        error: hasAuthError,
        requiresAuth,
      },
    },
  } = state;

  let screenMode;
  if (hasAuthError) {
    screenMode = 'error';
  } else if (!isLoggedIn && requiresAuth) {
    screenMode = 'unauthenticated';
  } else if (playStatus === 'playing') {
    screenMode = 'playing';
  } else if (playStatus === 'paused') {
    screenMode = 'paused';
  } else {
    screenMode = cassetteStatus; // idle, selecting, loaded
  }

  const selectedCassette = cassettesById[selectedCassetteId];
  const numOfActions = selectedCassette ? selectedCassette.numOfActions : 0;

  return {
    screenMode,
    selectedCassetteId,
    numOfActions,
  };
};


export { VCRScreen };

export default connect(mapStateToProps)(VCRScreen);
