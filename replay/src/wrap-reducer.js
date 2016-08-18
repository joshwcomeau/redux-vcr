import { actionTypes } from 'redux-vcr.shared';

const { REWIND_CASSETTE_AND_RESTORE_APP } = actionTypes;


// A higher-order reducer that watches for a very specific action, and wipes
// all non-VCR state when it sees it.
//
// Used to ensure that when a cassette starts playing, everything is as it
// should be.
export default function wrapReducer(reducer) {
  return (state = {}, action) => {
    switch (action.type) {
      // When our special action is dispatched, we want to re-initialize
      // the state, so that our cassette can be played from a blank state.
      case REWIND_CASSETTE_AND_RESTORE_APP:
        // By passing an initial state solely consisting of our reduxVCR
        // slice, we force all other combined reducers to use their default
        // (initial) state. The action has no type, so no possible side
        // effects can occur.
        return reducer({ reduxVCR: state.reduxVCR }, {});

      default:
        // Otherwise, delegate to the original reducer.
        return reducer(state, action);
    }
  };
}
