import { actionTypes, actionCreators } from 'redux-vcr.shared';
import defaultPlayHandler from './play-handler';

const { PLAY_CASSETTE, STOP_CASSETTE } = actionTypes;
const { rewindCassetteAndRestoreApp } = actionCreators;


const createReplayMiddleware = ({
  playHandler = defaultPlayHandler,
  maximumDelay,
} = {}) => (
  store => next => action => {
    switch (action.type) {
      case PLAY_CASSETTE: {
        const { status } = store.getState().reduxVCR.play;

        // If the cassette is already playing, no action is needed.
        if (status === 'playing') {
          return null;
        }

        // If the cassette is currently `paused`, we can just start playing it.
        // However, if the cassette is `stopped`, we need to reset the state,
        // so that we can be sure it plays in the right context.
        if (status === 'stopped') {
          next(rewindCassetteAndRestoreApp());
        }

        // Deploy the action, so that the store's status is updated
        next(action);

        // Finally, pass the data onto our playHandler
        return playHandler({
          store,
          next,
          maximumDelay,
        });
      }

      case STOP_CASSETTE: {
        const { status } = store.getState().reduxVCR.play;

        if (status !== 'stopped') {
          next(rewindCassetteAndRestoreApp());
        }

        return next(action);
      }

      default: {
        return next(action);
      }
    }
  }
);

export default createReplayMiddleware;
