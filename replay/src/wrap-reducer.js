import { actionTypes, reduxVCRReducer } from './shared-resolver';

const { REWIND_CASSETTE_AND_RESTORE_APP } = actionTypes;


// A higher-order reducer that tackles all ReduxVCR actions.
// It works by merging in the original reducer's returned state with
// our own reducer's returned state.
// One special action exists, to reset the overall state of the app,
// when replaying cassettes.
export default function wrapReducer(reducer) {
  return (state = {}, action) => {
    // Otherwise, delegate to the original reducer.
    const { reduxVCR, ...otherState } = state;

    switch (action.type) {
      // When our special action is dispatched, we want to re-initialize
      // the state, so that our cassette can be played from a blank state.
      case REWIND_CASSETTE_AND_RESTORE_APP: {
        // Preserve our reduxVCR state, while resetting all other state
        // to their default values.
        return {
          ...reducer({}, {}),
          reduxVCR: reduxVCRReducer(reduxVCR, action),
        };
      }

      default: {
        return {
          ...reducer(otherState, action),
          reduxVCR: reduxVCRReducer(reduxVCR, action),
        };
      }
    }
  };
}
