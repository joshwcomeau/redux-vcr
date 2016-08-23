import useLocal from './use-local';

const { actionTypes, actionCreators } = useLocal
  ? require('../../shared/src')
  : require('redux-vcr.shared');

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

const createRetrieveMiddleware = ({
  dataHandler,
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
  const credentials = localStorage.getItem(localStorageKey);
  if (credentials && requiresAuth) {
    dataHandler
      .signInWithCredential(JSON.parse(credentials))
      .then((user) => {
        store.dispatch(signInSuccess({ user }));
      });
      // Don't catch any errors; if it fails, they can sign in the normal way.
  }

  return next => action => {
    switch (action.type) {
      case SIGN_IN_REQUEST: {
        return dataHandler
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
          localStorage.setItem(localStorageKey, JSON.stringify(credential));
        }

        return next(action);
      }

      case CASSETTES_LIST_REQUEST: {
        dataHandler
          .retrieveList()
          .then(snapshot => snapshot.val())
          .then(cassettes => next(cassettesListSuccess({ cassettes })))
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
};

export default createRetrieveMiddleware;
