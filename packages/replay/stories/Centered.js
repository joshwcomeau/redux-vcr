import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Centered = ({ children, vertical, horizontal, className, styles }) => {
  const classes = classNames(className, 'centered', {
    'story-horizontally-centered': horizontal,
    'story-vertically-centered': vertical,
  });

  return (
    <div className={classes} style={styles}>
      {children}
    </div>
  );
};

Centered.propTypes = {
  children: PropTypes.node,
  vertical: PropTypes.bool,
  horizontal: PropTypes.bool,
  className: PropTypes.string,
  styles: PropTypes.object,
};

Centered.defaultProps = {
  styles: { padding: '0 2rem' },
  vertical: true,
  horizontal: true,
};

export default Centered;
