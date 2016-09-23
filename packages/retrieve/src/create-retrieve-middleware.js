import invariant from 'invariant';
import {
  actionTypes,
  actionCreators,
  errors,
  getQueryParams,
} from 'redux-vcr.shared';

const {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  CASSETTES_LIST_REQUEST,
  SELECT_CASSETTE,
  SIGN_OUT_REQUEST,
} = actionTypes;
const {
  cassetteActionsReceive,
  cassettesListSuccess,
  cassettesListFailure,
  signInSuccess,
  signInFailure,
  signOutRequest,
  signOutSuccess,
  signOutFailure,
  setAuthRequirement,
} = actionCreators;
const { noCassettesFound, initialActionWithoutCassette } = errors;

const createRetrieveMiddleware = ({
  retrieveHandler,
  appName,
  requiresAuth = true,
} = {}) => store => {
  // If the user provided an `appName`, we want to use it as a localStorage
  // key, so that the user can have multiple ReduxVCR apps.
  const localStorageKey = appName ? `redux-vcr-${appName}` : 'redux-vcr-app';

  // Most usecases require that the developer authenticate, but in rare cases,
  // the user might want to allow anyone to view recorded sessions.
  store.dispatch(setAuthRequirement({ requiresAuth }));

  // On page-load, first check to see if we already have a valid credential.
  const credentials = window.localStorage.getItem(localStorageKey);

  if (credentials && requiresAuth) {
    retrieveHandler
      .signInWithCredential(JSON.parse(credentials))
      .then(user => {
        store.dispatch(signInSuccess({ user }));
      })
      .catch(error => {
        store.dispatch(signInFailure({ error }));
      });
  }

  // We may have linked to a specific cassette & action, in the query params.
  const initialCassetteId = getQueryParams('cassetteId');
  const initialActionIndex = getQueryParams('actionIndex');

  invariant(
    typeof initialActionIndex !== 'undefined' && !initialCassetteId,
    initialActionWithoutCassette()
  );

  return next => action => {
    switch (action.type) {
      case SIGN_IN_REQUEST: {
        return retrieveHandler
          .signInWithPopup(action.authMethod)
          .then(({ user, credential }) => {
            // Using store.dispatch instead of next because we _do_ want
            // this action to trigger this middleware.
            store.dispatch(signInSuccess({ user, credential }));
          })
          .catch(error => {
            console.error('Problem authenticating with Firebase:', error);
            next(signInFailure({ error }));
          });
      }

      case SIGN_IN_SUCCESS: {
        // Before passing the good news onto the store, we want to store
        // the user's accessToken in localStorage, so that they can skip
        // this process next time.
        const { credential } = action;

        if (credential) {
          window.localStorage.setItem(localStorageKey, JSON.stringify(credential));
        }

        return next(action);
      }

      case CASSETTES_LIST_REQUEST: {
        retrieveHandler
          .retrieveList()
          .then(snapshot => snapshot.val())
          .then(cassettes => {
            if (cassettes) {
              next(cassettesListSuccess({ cassettes }));
            } else {
              console.error(noCassettesFound());
              next(cassettesListFailure({ error: 'empty' }));
            }
          })
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

        retrieveHandler
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
        retrieveHandler
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
};

export default createRetrieveMiddleware;
