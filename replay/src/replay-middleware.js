import playActions from './play-actions';
import {
  PLAY_CASSETTE,
  rewindCassetteAndRestoreApp,
} from 'redux-vcr.shared/actions';


const replayMiddleware = store => next => action => {
  switch (action.type) {
    case PLAY_CASSETTE: {
      // If the cassette is currently `paused`, we can just start playing it.
      // However, if the cassette is `stopped`, we need to reset the state,
      // so that we can be sure it plays in the right context.
      const { status } = store.getState().reduxVCR.play;
      if (status === 'stopped') {
        next(rewindCassetteAndRestoreApp());
      }

      next(action);

      return playActions({
        store,
        next,
      });
    }

    default: {
      return next(action);
    }
  }
};

export default replayMiddleware;
