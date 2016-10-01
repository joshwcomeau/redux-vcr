import merge from 'lodash.merge';
import invariant from 'invariant';
import { actionTypes, actionCreators, errors } from 'redux-vcr.shared';

import createReplayHandler from './create-replay-handler';

const {
  PLAY_CASSETTE,
  PAUSE_CASSETTE,
  STOP_CASSETTE,
  EJECT_CASSETTE,
} = actionTypes;
const {
  rewindCassetteAndRestoreApp,
  changeMaximumDelay,
  updateCassetteInitialState,
} = actionCreators;
const {
  playWithNoCassetteSelected,
  playWithInvalidCassetteSelected,
} = errors;

const createReplayMiddleware = ({
  replayHandler = createReplayHandler(),
  maximumDelay,
  overwriteCassetteState,
  onPlay,
  onPause,
  onStop,
  onEject,
} = {}) => store => next => {
  if (typeof maximumDelay !== 'undefined') {
    next(changeMaximumDelay({ maximumDelay }));
  }

  return action => {
    switch (action.type) {
      case PLAY_CASSETTE: {
        const state = store.getState().reduxVCR;
        const {
          play: { status },
          cassettes: { byId, selected },
        } = state;

        // If the cassette is already playing, no action is needed.
        if (status === 'playing') {
          break;
        }

        // Ensure that a valid cassette is selected.
        invariant(
          !!selected,
          playWithNoCassetteSelected()
        );

        invariant(
          !!byId[selected],
          playWithInvalidCassetteSelected(selected, byId)
        );

        // If the cassette is currently `paused`, we can just start playing it.
        // However, if the cassette is `stopped`, we need to reset the state,
        // so that we can be sure it plays in the right context.
        if (status === 'stopped') {
          // Update our initial state if an overwrite is provided
          if (overwriteCassetteState) {
            const { initialState } = byId[selected];

            // If the provided value is an object, we want to deep merge it.
            // Otherwise, if the provided value is a function, we want to
            // apply it with the initial state.
            const newState = typeof overwriteCassetteState === 'function'
              ? overwriteCassetteState(initialState)
              : merge({}, initialState, overwriteCassetteState);

            next(updateCassetteInitialState({ selected, newState }));
          }

          next(rewindCassetteAndRestoreApp());
        }

        next(action);

        replayHandler.play({
          store,
          next,
        });

        if (onPlay) { onPlay(store.dispatch, store.getState); }

        break;
      }

      case PAUSE_CASSETTE: {
        const { status } = store.getState().reduxVCR.play;

        if (status !== 'paused' && onPause) {
          onPause(store.dispatch, store.getState);
        }

        next(action);
        break;
      }

      case STOP_CASSETTE: {
        const { status } = store.getState().reduxVCR.play;

        next(action);

        if (status !== 'stopped') {
          next(rewindCassetteAndRestoreApp());

          if (onStop) { onStop(store.dispatch, store.getState); }
        }

        break;
      }

      case EJECT_CASSETTE: {
        const { status } = store.getState().reduxVCR.cassettes;

        next(action);

        if (status === 'loaded' && onEject) {
          onEject(store.dispatch, store.getState);
        }

        break;
      }

      default: {
        next(action);
      }
    }
  };
};

export default createReplayMiddleware;
