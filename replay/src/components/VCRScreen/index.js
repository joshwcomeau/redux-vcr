import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './index.scss';


const VCRScreen = ({ children, label, textColor, effects, onClick }) => {
  const bufferClasses = classNames('vcr-screen-buffer', {
    vertical: effects.includes('scrolling'),
  });
  const contentsClasses = classNames([
    'vcr-screen-contents',
    textColor,
    ...effects,
    {
      // If we've supplied a label, we need to make space for it by
      // edging our main content down a bit.
      'edged-down': !!label,
    },
  ]);

  return (
    <div className="vcr-screen">
      <div className={bufferClasses}>
        <div className="vcr-screen-label">{label}</div>
        <div className={contentsClasses}>
          {children}
        </div>
      </div>
    </div>
  );
};

VCRScreen.propTypes = {
  children: PropTypes.node,
  textColor: PropTypes.oneOf(['green', 'red']),
  label: PropTypes.string,
  effects: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func.isRequired,
};

VCRScreen.defaultProps = {
  textColor: 'green',
  effects: [],
};


function getScreenLabel({ cassetteStatus, playStatus }) {
  if (cassetteStatus !== 'loaded') {
    return '';
  }
  switch (playStatus) {
    case 'playing': return 'Now Playing';
    case 'paused': return 'Paused';
    default: return 'Selected';
  }
}

function getScreenContents({
  isLoggedIn,
  hasAuthError,
  requiresAuth,
  cassetteStatus,
  selectedCassette,
}) {
  if (hasAuthError) {
    return 'ERROR. See console for details.';
  }

  if (!isLoggedIn && requiresAuth) {
    return 'Click to authenticate with GitHub';
  }

  switch (cassetteStatus) {
    case 'idle': return 'Click to select a cassette';
    case 'selecting': return 'Selecting...';
    default: return selectedCassette;
  }
}

function getScreenEffects({
  isLoggedIn,
  hasAuthError,
  requiresAuth,
  cassetteStatus,
}) {
  const effects = [];

  if (hasAuthError) {
    effects.push('flashing', 'centered');
  } else if (!isLoggedIn && requiresAuth) {
    effects.push('scrolling', 'centered');
  } else if (cassetteStatus !== 'loaded') {
    effects.push('centered');
  }

  return effects;
}

function getScreenTextColor({ hasAuthError }) {
  return hasAuthError ? 'red' : 'green';
}

const mapStateToProps = state => {
  console.log('STATE', state);
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
        selected: selectedCassette,
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

  return {
    children: getScreenContents({
      isLoggedIn,
      hasAuthError,
      requiresAuth,
      cassetteStatus,
      selectedCassette,
    }),
    label: getScreenLabel({ cassetteStatus, playStatus }),
    textColor: getScreenTextColor({ hasAuthError }),
    effects: getScreenEffects({
      isLoggedIn,
      hasAuthError,
      requiresAuth,
      cassetteStatus,
    }),
  };
};


export { VCRScreen };

export default connect(mapStateToProps)(VCRScreen);
