import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const VCRDoor = ({ label, isOpen, onClick }) => {
  return (
    <div className="vcr-door" onClick={onClick}>
      <div className={`cassette-slot-door ${isOpen ? 'is-open' : ''}`}>
        <span className="cassette-slot-door-label">
          {label}
        </span>
      </div>
      <div className="cassette-slot" />
    </div>
  );
};

VCRDoor.propTypes = {
  label: PropTypes.string,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

VCRDoor.defaultProps = {
  label: 'HI-FI STEREO SYSTEM',
  isOpen: false,
};


export default VCRDoor;
