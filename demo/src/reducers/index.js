import { combineReducers } from 'redux';
// import { reduxVCRReducer } from 'redux-vcr.replay';
import { reduxVCRReducer } from '../../../replay/src';

import answers from './answers.reducer';


export default combineReducers({ answers, reduxVCR: reduxVCRReducer });
