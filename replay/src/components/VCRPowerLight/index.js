import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const VCRPowerLight = ({ mode }) => {
  const classes = classNames('vcr-power-light', {
    'light-off': mode === 'stopped',
    'light-amber': mode === 'paused',
    'light-green': mode === 'playing',
  });

  return (
    <div className={classes}>
      <div className="lightbulb" />
    </div>
  );
};

VCRPowerLight.propTypes = {
  mode: PropTypes.oneOf([
    'stopped',
    'playing',
    'paused',
  ]),
};

export default VCRPowerLight;
