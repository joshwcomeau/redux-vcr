import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.css';

const Button = ({ children, value, toggled, primary, grouped, onClick }) => (
  <button
    className={classNames('button', { toggled, primary, grouped })}
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
  primary: PropTypes.bool,
  grouped: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default Button;
