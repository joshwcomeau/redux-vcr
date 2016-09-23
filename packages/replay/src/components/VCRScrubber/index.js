import React, { PropTypes } from 'react';
import ReactSlider from 'react-slider';

import './index.scss';

const VCRScrubber = ({ numOfActions, currentPosition = 0 }) => {
  return (
    <ReactSlider
      withBars
      className="vcr-scrubber"
      min={0}
      max={numOfActions - 1}
      value={currentPosition}
      onChange={val => console.log('Slider value', val)}
    />
  );
};

VCRScrubber.propTypes = {
  numOfActions: PropTypes.number.isRequired,
  currentPosition: PropTypes.number,
};

export default VCRScrubber;
