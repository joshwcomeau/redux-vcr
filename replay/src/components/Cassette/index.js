import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { themes } from '../../data/cassette-themes';
import sampleWithProbability from '../../utils/sample-with-probability';
import './index.scss';


const Cassette = ({
  id,
  label,
  timestamp,
  numOfActions,
  handleClick,
  theme,
}) => {
  const classes = classNames(
    'cassette',
    `theme-${theme}`
  );


  let labelHeader;
  switch (theme) {
    case 'tdk': {
      labelHeader = (
        <div className="tdk-bars">
          <div /><div /><div />
        </div>
      );
      break;
    }
    default: {
      // nothing
    }
  }

  let labelFooter;
  switch (theme) {
    case 'polaroid': {
      labelFooter = (
        <div className="label-footer">
          <div className="polaroid-boxes">
            <div /><div /><div /><div /><div />
          </div>
          Polaroid
        </div>
      );
      break;
    }

    case 'kodak': {
      labelFooter = (
        <div className="label-footer">Kodak</div>
      );
      break;
    }

    case 'tdk': {
      labelFooter = (
        <div className="label-footer">
          <div className="tdk-logo">TDK</div>
          <div className="tdk-source">Made in Japan</div>
        </div>
      );
      break;
    }

    default: {
      labelFooter = <div className="label-footer">VHS</div>;
      break;
    }
  }

  return (
    <div className={classes} onClick={() => handleClick({ id })}>
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
          {labelHeader}
          <div className="line">
            <span className="line-name">Name: </span>
            {label || id}
          </div>
          <div className="line">
            <span className="line-name">Recorded: </span>
            {moment(timestamp).format('MMM Do, h:mm A')}
            <span className="line-name indented">Actions: </span>
            {numOfActions}
          </div>
          {labelFooter}
        </div>
      </div>
    </div>
  );
};

Cassette.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  timestamp: PropTypes.number.isRequired,
  numOfActions: PropTypes.number.isRequired,
  handleClick: PropTypes.func,
  theme: PropTypes.oneOf(Object.keys(themes)),
};

Cassette.defaultProps = {
  handleClick() {},
  theme: sampleWithProbability(themes),
};

export { Cassette };
export default Cassette;
