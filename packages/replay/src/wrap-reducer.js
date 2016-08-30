import {
  actionTypes,
  reduxVCRReducer,
  cassetteSelectors,
} from 'redux-vcr.shared';

const { REWIND_CASSETTE_AND_RESTORE_APP } = actionTypes;
const { selectedCassetteSelector } = cassetteSelectors;


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
      // the state, so that our cassette can be played from the correct state.
      case REWIND_CASSETTE_AND_RESTORE_APP: {
        // If our cassette has an initialState, use that.
        const { initialState } = selectedCassetteSelector(state);

        return {
          ...reducer(initialState, {}),
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
