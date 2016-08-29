import React, { PropTypes } from 'react';

import './index.css';

const Onboarding = ({ completeOnboarding }) => (
  <div className="onboarding">
    <h2>Welcome to this poll thing!</h2>
    <button onClick={completeOnboarding}>
      Start voting!
    </button>
  </div>
);

Onboarding.propTypes = {
  completeOnboarding: PropTypes.func,
};

export default Onboarding;
