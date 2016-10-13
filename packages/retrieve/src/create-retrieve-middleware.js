import {
  actionTypes,
  actionCreators,
  errors,
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
  cassettesListRequest,
  cassettesListSuccess,
  cassettesListFailure,
  selectCassette,
  signInSuccess,
  signInFailure,
  signOutRequest,
  signOutSuccess,
  signOutFailure,
  setAuthRequirement,
} = actionCreators;
const {
  noCassettesFound,
  permissionDenied,
} = errors;


const createRetrieveMiddleware = ({
  retrieveHandler,
  appName,
  requiresAuth = true,
  initialCassetteId,
} = {}) => (store) => {
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
      .then((user) => {
        store.dispatch(signInSuccess({ user }));
      })
      .catch((error) => {
        store.dispatch(signInFailure({ error }));
      });
  }

  return next => (action) => {
    switch (action.type) {
      case SIGN_IN_REQUEST: {
        return retrieveHandler
          .signInWithPopup(action.authMethod)
          .then(({ user, credential }) => {
            // Using store.dispatch instead of next because we _do_ want
            // this action to trigger this middleware.
            store.dispatch(signInSuccess({ user, credential }));
          })
          .catch((error) => {
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

        // Fetch our initial list of cassettes, so that they're ready and
        // waiting for the admin
        store.dispatch(cassettesListRequest());

        return next(action);
      }

      case CASSETTES_LIST_REQUEST: {
        // If this is our very first list request, we may also wish to select
        // an initial cassette.
        const state = store.getState().reduxVCR;
        const isFirstRequest = Object.keys(state.cassettes.byId).length === 0;
        const shouldFetchInitialCassette = (
          isFirstRequest && !!initialCassetteId
        );

        retrieveHandler
          .retrieveList()
          .then(snapshot => snapshot.val())
          .then((cassettes) => {
            if (cassettes) {
              next(cassettesListSuccess({ cassettes }));

              if (shouldFetchInitialCassette) {
                store.dispatch(selectCassette({ id: initialCassetteId }));
              }
            } else {
              console.error(noCassettesFound());
              next(cassettesListFailure({ error: 'empty' }));
            }
          })
          .catch((error) => {
            if (error.code === 'PERMISSION_DENIED') {
              console.error(
                permissionDenied(),
                error
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
          .then((cassetteActions) => {
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
