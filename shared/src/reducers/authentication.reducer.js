import { combineReducers } from 'redux';

import {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT_SUCCESS,
  CASSETTES_LIST_FAILURE,
  SET_AUTH_REQUIREMENT,
} from '../actions';


const defaultStates = {
  loggedIn: false,
  requiresAuth: true,
  error: null,
};

function requiresAuthReducer(state = defaultStates.requiresAuth, action) {
  switch (action.type) {
    case SET_AUTH_REQUIREMENT: return action.requiresAuth;
    default: return state;
  }
}

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
  requiresAuth: requiresAuthReducer,
});
