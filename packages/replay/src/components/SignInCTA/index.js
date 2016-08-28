import React, { PropTypes } from 'react';

import Icon from '../Icon';
import './index.scss';

const SignInCTA = ({ onClick }) => {
  return (
    <div className="sign-in-cta">
      <button onClick={() => onClick({ authMethod: 'github.com' })}>
        <Icon value="github" size={32} color="#FFFFFF" />
        Sign In
      </button>
      <div className="explanation">
        {"Redux VCR requires authentication, to protect users' privacy. "}
        <a href="">Read more.</a>
      </div>
    </div>
  );
};

SignInCTA.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default SignInCTA;
