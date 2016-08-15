import { combineReducers } from 'redux';

import answers from './answers.reducer';
import reduxVCR from '../../../shared/lib/reducers';

export default combineReducers({ answers, reduxVCR });
