import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Icon from '../Icon';
import './index.scss';


const VCRButton = ({
  children,
  className,
  iconValue,
  iconSize,
  glowing,
  rounded,
  onClick,
  toggled,
  toggleable,
}) => {
  const classes = classNames('vcr-button', className, {
    'vcr-button-glowing': glowing,
    'vcr-button-rounded': rounded,
    'vcr-button-toggleable': toggleable,
  });

  let toggleIndicator;
  if (toggleable) {
    const toggleIndicatorClasses = classNames('toggle-indicator', { toggled });

    toggleIndicator = <div className={toggleIndicatorClasses} />;
  }

  return (
    <button className={classes} onClick={onClick}>
      {children || <Icon value={iconValue} size={iconSize} color="#f4f7f8" />}
      {toggleIndicator}
    </button>
  );
};

VCRButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  iconValue: PropTypes.string,
  iconSize: PropTypes.number,
  glowing: PropTypes.bool,
  rounded: PropTypes.bool,
  toggled: PropTypes.bool,
  toggleable: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

VCRButton.defaultProps = {
  iconSize: 12,
  handleClick() {},
};

export default VCRButton;
