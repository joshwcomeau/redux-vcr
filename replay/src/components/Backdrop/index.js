import React, { PropTypes } from 'react';
import FlipMove from 'react-flip-move';

import Icon from '../Icon';
import './index.scss';

const Backdrop = ({
  isShown,
  handleClickClose,
  animation,
  opacity,
  background,
  closeColor,
}) => {
  let backdropMarkup;

  if (isShown) {
    backdropMarkup = (
      <span key="bd">
        {/* Nesting inside a span because FlipMove applies opacity to it. */}
        {/* We avoid having it overwrite our custom opacity this way. */}
        <div className="backdrop" style={{ opacity, background }}>
          <button className="close-backdrop" onClick={handleClickClose}>
            <Icon value="close" size={48} color={closeColor} />
          </button>
        </div>
      </span>
    );
  }

  return (
    <FlipMove
      enterAnimation={animation}
      leaveAnimation={animation}
      className="backdrop-wrapper"
    >
      {isShown ? backdropMarkup : <div />}
    </FlipMove>
  );
};

Backdrop.propTypes = {
  isShown: PropTypes.bool,
  handleClickClose: PropTypes.func,
  animation: PropTypes.oneOf([
    'elevator',
    'fade',
    'accordionHorizontal',
    'accordionVertical',
  ]),
  opacity: PropTypes.number,
  background: PropTypes.string,
  closeColor: PropTypes.string,
};

Backdrop.defaultProps = {
  handleClickClose() {},
  animation: 'fade',
  opacity: 0.75,
  background: '#000',
  closeColor: '#F11E0E',
};

export default Backdrop;
