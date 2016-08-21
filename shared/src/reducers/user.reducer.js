import {
  SIGN_IN_RECEIVE,
  SIGN_OUT,
} from '../actions';


const defaultState = null;

export default function userReducer(state = defaultState, action) {
  switch (action.type) {
    case SIGN_IN_RECEIVE: return action.user;
    case SIGN_OUT: return null;
    default: return state;
  }
}


// ////////////////////////
// SELECTORS /////////////
// //////////////////////
