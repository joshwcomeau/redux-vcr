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

import FirebaseHandler from './utils/firebase-handler';


// We want to split our action types from our action creators.
const { actionTypes, actionCreators } = actions.reduce((memo, actionItem) => {
  if (typeof actionItem === 'function') {
    memo.actionCreators.push(actionItem);
  } else {
    memo.actionTypes.push(actionItem);
  }

  return memo;
}, { actionTypes: [], actionCreators: [] });


export {
  actionTypes,
  actionCreators,
  actionsReducer,
  actionSelectors,
  cassettesReducer,
  cassetteSelectors,
  playReducer,
  playSelectors,
  FirebaseHandler,
};
