import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const VCRScreen = ({ children, label, textColor, effect, onClick }) => {
  const bufferClasses = classNames('vcr-screen-buffer', {
    vertical: effect === 'scrolling',
  });
  const contentsClasses = classNames('vcr-screen-contents', textColor, {
    // If we've supplied a label, we need to make space for it by
    // edging our main content down a bit.
    'edged-down': !!label,
    flashing: effect === 'flashing',
    scrolling: effect === 'scrolling',
  });


  return (
    <div className="vcr-screen" onClick={onClick}>
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
  effect: PropTypes.oneOf(['flashing', 'scrolling']),
  onClick: PropTypes.func.isRequired,
};

export default VCRScreen;
