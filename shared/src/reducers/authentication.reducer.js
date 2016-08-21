import { combineReducers } from 'redux';

import {
  SIGN_IN_REQUEST,
  SIGN_IN_RECEIVE,
  SIGN_IN_FAILURE,
  SIGN_OUT,
} from '../actions';


const defaultStates = {
  loggedIn: false,
  error: null,
};

function loggedInReducer(state = defaultStates.loggedIn, action) {
  switch (action.type) {
    case SIGN_IN_RECEIVE: return true;
    case SIGN_OUT: return false;
    default: return state;
  }
}

function errorReducer(state = defaultStates.error, action) {
  switch (action.type) {
    case SIGN_IN_REQUEST:
    case SIGN_IN_RECEIVE: return null;
    case SIGN_IN_FAILURE: return action.error;
    default: return state;
  }
}

export default combineReducers({
  loggedIn: loggedInReducer,
  error: errorReducer,
});
