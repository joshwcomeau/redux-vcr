import {
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
} from '../actions';


const defaultState = null;

export default function userReducer(state = defaultState, action) {
  switch (action.type) {
    case SIGN_IN_SUCCESS: return action.user;
    case SIGN_OUT_SUCCESS: return null;
    default: return state;
  }
}


// ////////////////////////
// SELECTORS /////////////
// //////////////////////
