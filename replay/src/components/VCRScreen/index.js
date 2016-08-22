import React, { PropTypes } from 'react';
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
  effects: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func.isRequired,
};

export default VCRScreen;
