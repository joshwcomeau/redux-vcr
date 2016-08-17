import { createSelector } from 'reselect';

import {
  SIGN_IN_RECEIVE,
} from '../actions';


const defaultState = null;

export default function userReducer(state = defaultState, action) {
  switch (action.type) {
    case SIGN_IN_RECEIVE: return action.user;
    default: return state;
  }
}


// ////////////////////////
// SELECTORS /////////////
// //////////////////////
const userSelector = state => state.reduxVCR.user;

export const loggedInSelector = createSelector(
  userSelector,
  (user) => !!user
);
