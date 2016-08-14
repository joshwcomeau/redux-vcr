import React, { PropTypes } from 'react';
import moment from 'moment';

import './index.scss';


const Casette = ({ id, label, timestamp, numOfActions, handleClick }) => {
  return (
    <div className="casette" onClick={() => handleClick({ id })}>
      <div className="front">
        <div className="head" />
        <div className="spool left-spool">
          <div className="tape" />
        </div>
        <div className="spool right-spool">
          <div className="tape" />
        </div>
      </div>

      <div className="spine">
        <div className="mould-marks">
          <div className="seam" />
          <div className="square" />
        </div>
        <div className="label">
          <div className="line">
            <span className="line-name">Name: </span>
            {label || id}
          </div>
          <div className="line">
            <span className="line-name">Recorded: </span>
            {moment(timestamp).format('MMMM Do YYYY, h:mm A')}
            <span className="line-name indented">Actions: </span>
            {numOfActions}
          </div>
        </div>
        <div className="vhs-footer">VHS</div>
      </div>
    </div>
  );
};

Casette.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  timestamp: PropTypes.number.isRequired,
  numOfActions: PropTypes.number.isRequired,
  handleClick: PropTypes.func,
  // theme: PropTypes.oneOf(['rainbow', ''])
};

Casette.defaultProps = {
  // TODO: Make this randomly select from the list.
  theme: 'rainbow',
  handleClick() {},
};

export default Casette;
