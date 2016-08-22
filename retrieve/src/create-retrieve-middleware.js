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
          if (error.code === 'PERMISSION_DENIED') {
            console.error(
              "Oh no! Firebase didn't let us fetch from /cassettes.\n" +
              "The rules you've set don't allow you to access this resource." +
              '\n\n' +
              'For help setting up the rules, see PLACEHOLDER.\n' +
              "Here's the Firebase error that prompted this message:"
            );
          } else {
            console.error('An error has occurred, and we were unable to fetch the cassettes.');
          }

          console.error(error);

          // Using store.dispatch instead of next because we _do_ want
          // this action to trigger this middleware.
          store.dispatch(signOutRequest());
          next(cassettesListFailure({ error }));
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

      return next(action);
    }

    default: {
      return next(action);
    }
  }
};

export default createRetrieveMiddleware;
