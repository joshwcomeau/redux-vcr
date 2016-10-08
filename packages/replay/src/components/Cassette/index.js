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
        <div className="cassette-label-footer">
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
        <div className="cassette-label-footer">Kodak</div>
      );
      break;
    }

    case 'tdk': {
      labelFooter = (
        <div className="cassette-label-footer">
          <div className="tdk-logo">TDK</div>
          <div className="tdk-source">Made in Japan</div>
        </div>
      );
      break;
    }

    default: {
      labelFooter = <div className="cassette-label-footer">VHS</div>;
      break;
    }
  }

  const dateObject = new Date(timestamp);
  const dateString = dateObject.toDateString();
  const timeString = dateObject.toTimeString().substr(0, 5);
  const dateDisplayString = `${dateString} ${timeString}`;

  return (
    <div
      className={classes}
      style={styles}
      onClick={() => handleClick({ id })}
    >
      <div className="cassette-front">
        <div className="cassette-head" />
        <div className="cassette-spool left-spool">
          <div className="cassette-tape" />
        </div>
        <div className="cassette-spool right-spool">
          <div className="cassette-tape" />
        </div>
      </div>

      <div className="cassette-spine">
        <div className="cassette-mould-marks">
          <div className="cassette-seam" />
          <div className="cassette-square" />
        </div>
        <div className="cassette-label">
          {labelHeader}
          <div className="cassette-flex-line-group with-bottom-border">
            <div className="cassette-line">
              <span className="cassette-line-name">Name: </span>
              {label || id}
            </div>
          </div>
          <div className="cassette-flex-line-group">
            <div className="cassette-line cassette-line-long">
              <span className="cassette-line-name">Recorded: </span>
              {dateDisplayString}
            </div>
            <div className="cassette-line cassette-line-right">
              <span className="cassette-line-name">Actions: </span>
              {numOfActions}
            </div>
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
