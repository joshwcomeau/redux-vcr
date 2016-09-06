import React, { PropTypes } from 'react';
import classNames from 'classnames';

import themes from '../../data/cassette-themes';
import './index.scss';


const Cassette = ({
  id,
  label,
  timestamp,
  numOfActions,
  handleClick,
  theme,
  offset,
}) => {
  const classes = classNames(
    'cassette',
    `theme-${theme}`
  );

  const styles = {
    transform: `translateX(${offset}px)`,
  };


  let labelHeader;
  switch (theme) {
    case 'kodak': {
      labelHeader = (
        <div className="kodak-header" />
      );
      break;
    }
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
    <div
      className={classes}
      style={styles}
      onClick={() => handleClick({ id })}
    >
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
            {(new Date(timestamp)).toDateString()}
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
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

Cassette.defaultProps = {
  handleClick() {},
  theme: 'generic',
  offset: 0,
};

export { Cassette };
export default Cassette;
