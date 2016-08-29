import { combineReducers } from 'redux';

import answers from './answers.reducer';
import onboarding from './onboarding.reducer';

export default combineReducers({ answers, onboarding });
