import { combineReducers } from 'redux';

import {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT_SUCCESS,
  CASSETTES_LIST_FAILURE,
} from '../actions';


const defaultStates = {
  loggedIn: false,
  error: null,
};

function loggedInReducer(state = defaultStates.loggedIn, action) {
  switch (action.type) {
    case SIGN_IN_SUCCESS: return true;
    case SIGN_OUT_SUCCESS: return false;
    default: return state;
  }
}

function errorReducer(state = defaultStates.error, action) {
  switch (action.type) {
    // NOTE: Signing out doesn't clear the error, because we sign users
    // out immediately in response to certain errors.
    case SIGN_IN_REQUEST:
    case SIGN_IN_SUCCESS: return null;
    case CASSETTES_LIST_FAILURE:
    case SIGN_IN_FAILURE: return action.error;
    default: return state;
  }
}

export default combineReducers({
  loggedIn: loggedInReducer,
  error: errorReducer,
});
