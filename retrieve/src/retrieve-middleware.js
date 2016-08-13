import vcrDataHandler from '../utils/vcr-data-handler';
import {
  CASSETTES_LIST_REQUEST,
  SELECT_CASSETTE,
  PLAY_CASSETTE,
  cassetteActionsReceive,
  cassettesListReceive,
  incrementActionsPlayed,
  stopCasette,
  rewindCasetteAndRestoreApp,
} from '../vcr-actions';


const vcrRetrieveMiddleware = store => next => action => {
  switch (action.type) {
    case CASSETTES_LIST_REQUEST: {
      vcrDataHandler
        .retrieveList()
        .then(snapshot => snapshot.val())
        .then(cassettes => next(cassettesListReceive({ cassettes })));

      return next(action);
    }

    case SELECT_CASSETTE: {
      // If we already have the cassette's actions, no data-fetching is required.
      const storedActions = store.getState().reduxVCR.actions.byId;
      if (storedActions[action.id]) {
        return next(action);
      }

      vcrDataHandler
        .retrieveAction({ id: action.id })
        .then(snapshot => snapshot.val())
        .then(cassetteActions => {
          next(cassetteActionsReceive({
            id: action.id,
            cassetteActions,
          }));

          // Also dispatch the original action;
          // We still need to select the cassette we just received actions for.
          next(action);
        });

      return null;
    }

    case PLAY_CASSETTE: {
      // If the cassette is currently `paused`, we can just start playing it.
      // However, if the cassette is `stopped`, we need to reset the state,
      // so that we can be sure it plays in the right context.
      const { status } = store.getState().reduxVCR.play;
      if (status === 'stopped') {
        next(rewindCasetteAndRestoreApp());
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

function playActions({ store, next }) {
  const state = store.getState().reduxVCR;
  const selectedCasetteId = state.cassettes.selected;


  const { status } = state.play;
  const { currentIndex } = state.actions;

  const actions = state.actions.byId[selectedCasetteId];

  if (status !== 'playing') {
    return false;
  }

  // Dispatch the next action immediately, and increment the number played.
  const [currentAction, nextAction] = actions.slice(currentIndex);

  next(currentAction);
  next(incrementActionsPlayed());

  // If we're at the end of the cassette, set status to stopped.
  if (currentIndex === (actions.length - 1)) {
    return next(stopCasette());
  }

  window.setTimeout(
    () => playActions({ store, next }),
    nextAction.delay
  );
}

export default vcrRetrieveMiddleware;
