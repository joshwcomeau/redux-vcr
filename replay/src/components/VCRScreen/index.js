import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const VCRScreen = ({ children, label, textColor, scrolling, onClick }) => {
  // If we've supplied a label, we need to make space for it by
  // edging our main content down a bit.
  const contentsClasses = classNames('vcr-screen-contents', textColor, {
    'edged-down': !!label,
  });

  return (
    <div className="vcr-screen" onClick={onClick}>
      <div>
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
  scrolling: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default VCRScreen;
