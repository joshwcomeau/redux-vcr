import './utils/polyfills.js';

// This module is a little confusing because it contains some redux structure
// (action types, and action creators), as well as a reducer that holds
// recorded redux actions.

// These are all the actions that a user can do related to any of
// our reducers:
import * as actions from './actions';

// This, on the other hand, is the reducer and selectors for dealing with
// our special 'actions' reducer.
import actionsReducer, * as actionSelectors from './reducers/actions.reducer';

import cassettesReducer, * as cassetteSelectors from './reducers/cassettes.reducer';
import playReducer, * as playSelectors from './reducers/play.reducer';
import userReducer, * as userSelectors from './reducers/user.reducer';

// In addition to all the individual reducers, we want to export their combined
// root reducer.
import reduxVCRReducer from './reducers';

import createFirebaseHandler from './utils/create-firebase-handler';

import getQueryParam from './utils/get-query-param';
import * as errors from './utils/errors';


// We want to split our action types from our action creators.
const actionTypes = {};
const actionCreators = {};

// While for...in loops without checking the prototype is frowned upon,
// it's safe to use here because I'm explicitly creating the object above.
// eslint-disable-next-line guard-for-in, no-restricted-syntax
for (const key in actions) {
  const actionItem = actions[key];

  if (typeof actionItem === 'function') {
    actionCreators[key] = actionItem;
  } else {
    actionTypes[key] = actionItem;
  }
}

export {
  actionTypes,
  actionCreators,
  actionsReducer,
  actionSelectors,
  cassettesReducer,
  cassetteSelectors,
  playReducer,
  playSelectors,
  userReducer,
  userSelectors,
  reduxVCRReducer,
  createFirebaseHandler,
  getQueryParam,
  errors,
};
