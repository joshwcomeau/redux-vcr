import {
  SIGN_IN_RECEIVE,
  SIGN_OUT_SUCCESS,
} from '../actions';


const defaultState = null;

export default function userReducer(state = defaultState, action) {
  switch (action.type) {
    case SIGN_IN_RECEIVE: return action.user;
    case SIGN_OUT_SUCCESS: return null;
    default: return state;
  }
}


// ////////////////////////
// SELECTORS /////////////
// //////////////////////
