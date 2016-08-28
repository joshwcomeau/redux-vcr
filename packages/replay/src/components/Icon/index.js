import React, { PropTypes } from 'react';

import iconMap from '../../data/icon-map';


const Icon = ({ color, size, value, ...delegated }) => {
  const divStyles = {
    display: 'inline-block',
    width: size,
    height: size,
  };

  // Our default viewBox, used for all Material Design icons.
  // Can be overridden by iconMap
  const defaultViewBox = '0 0 24 24';

  // Our iconData can either be a the SVG data itself, as a string,
  // or it can be an object containing a `path` and `viewBox`.
  const iconData = iconMap[value];

  const path = iconData.path || iconData;
  const viewBox = iconData.viewBox || defaultViewBox;

  return (
    <div style={divStyles} className="icon">
      <svg
        {...delegated}
        viewBox={viewBox}
        style={{ fill: color, ...delegated.style }}
        dangerouslySetInnerHTML={{ __html: path }}
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
