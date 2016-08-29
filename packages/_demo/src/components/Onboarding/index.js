import React, { PropTypes } from 'react';

import Button from '../Button';
import './index.css';

const Onboarding = ({ completeOnboarding }) => (
  <div className="onboarding">
    <div className="main-content">
      <h2>Welcome to this poll thing!</h2>
      <Button primary onClick={completeOnboarding}>
        Start voting!
      </Button>
    </div>
  </div>
);

Onboarding.propTypes = {
  completeOnboarding: PropTypes.func,
};

export default Onboarding;
