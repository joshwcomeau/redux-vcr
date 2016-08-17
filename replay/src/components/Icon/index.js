import React, { PropTypes } from 'react';

import iconMap from '../../data/icon-map';


const Icon = ({ color, size, value, ...delegated }) => {
  const divStyles = {
    display: 'inline-block',
    width: size,
    height: size,
  };

  return (
    <div style={divStyles} className="icon">
      <svg
        {...delegated}
        viewBox="0 0 24 24"
        style={{ fill: color, ...delegated.style }}
        dangerouslySetInnerHTML={{ __html: iconMap[value] }}
      />
    </div>
  );
};

Icon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  value: PropTypes.string.isRequired,
};

Icon.defaultProps = {
  color: '#2f3233',
  size: 24,
};

export default Icon;
