import RetrieveDataHandler from './retrieve-data-handler';
import {
  CASSETTES_LIST_REQUEST,
  SELECT_CASSETTE,
  cassetteActionsReceive,
  cassettesListReceive,
} from '../../shared/actions';


const retrieveMiddleware = store => next => action => {
  switch (action.type) {
    case CASSETTES_LIST_REQUEST: {
      RetrieveDataHandler
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

      RetrieveDataHandler
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

    default: {
      return next(action);
    }
  }
};

export default retrieveMiddleware;
