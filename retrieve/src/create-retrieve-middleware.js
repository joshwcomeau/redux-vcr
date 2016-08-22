// import { actionTypes, actionCreators } from 'redux-vcr.shared';
import { actionTypes, actionCreators } from '../../shared/src';

const {
  SIGN_IN_REQUEST,
  CASSETTES_LIST_REQUEST,
  SELECT_CASSETTE,
  SIGN_OUT_REQUEST,
} = actionTypes;
const {
  cassetteActionsReceive,
  cassettesListReceive,
  cassettesListFailure,
  signInReceive,
  signInFailure,
  signOutRequest,
  signOutSuccess,
  signOutFailure,
} = actionCreators;

const createRetrieveMiddleware = ({ dataHandler }) => store => next => action => {
  switch (action.type) {
    case SIGN_IN_REQUEST: {
      return dataHandler
        .signIn(action.authMethod)
        .then(({ credential }) => {
          next(signInReceive({ user: credential }));
        })
        .catch(error => {
          console.error('Problem authenticating with Firebase:', error);
          next(signInFailure({ error }));
        });
    }

    case CASSETTES_LIST_REQUEST: {
      dataHandler
        .retrieveList()
        .then(snapshot => snapshot.val())
        .then(cassettes => next(cassettesListReceive({ cassettes })))
        .catch(error => {
          next(cassettesListFailure({ error }));

          console.error(
            'Oh no! We were unable to receive the list of cassettes.' +
            "Here's what Firebase had to say about it:");
          console.info(error);
          console.error(
            "We've automatically logged you out from Firebase." +
            'To sign in and retry, click the VCR screen :)'
          );

          // Using store.dispatch instead of next because we _do_ want
          // this action to trigger this middleware.
          store.dispatch(signOutRequest());
        });

      return next(action);
    }

    case SELECT_CASSETTE: {
      // If we already have the cassette's actions, no data-fetching is required.
      const storedActions = store.getState().reduxVCR.actions.byId;
      if (storedActions[action.id]) {
        return next(action);
      }

      dataHandler
        .retrieveActions({ id: action.id })
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

    case SIGN_OUT_REQUEST: {
      dataHandler
        .signOut()
        .then(() => next(signOutSuccess()))
        .catch(error => next(signOutFailure({ error })));
    }

    default: {
      return next(action);
    }
  }
};

export default createRetrieveMiddleware;
