import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.css';

const Button = ({ children, value, toggled, onClick }) => (
  <button
    className={classNames('button', { toggled })}
    value={value}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  toggled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default Button;
