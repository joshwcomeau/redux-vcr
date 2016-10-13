/* eslint-disable max-len */
// /////////////////////// //
// /////// CAPTURE ////// //
// ///////////////////// //
export const captureMiddlewareGivenInvalidPersistHandler = () => `
Redux VCR error:
You passed an invalid persistHandler to createCaptureMiddleware.

Persist handlers need a 'persist' method that can be invoked whenever the capture middleware has something to persist.

You either failed to provide a persistHandler, or your persistHandler does not implement a 'persist' method.
`;



// /////////////////////// //
// /////// PERSIST ////// //
// ///////////////////// //
export const persistedCassetteNotAnObject = cassette => `
Redux VCR error:
You tried to persist an invalid or nonexistent cassette.

Cassettes should be objects with a timestamp, an array of actions, and an optional 'data' object with cassette metadata.

You provided: ${JSON.stringify(cassette, null, 2)}, which is of type '${typeof cassette}'.

You are likely seeing this error because 'createCaptureMiddleware' was not set up properly, or because you're making a custom Capture module and it isn't conforming to the specification.
`;

export const persistedCassetteInvalidTimestamp = timestamp => `
Redux VCR error:
You tried to persist a cassette without a valid 'timestamp'.

Cassettes need a numeric timestamp, eg. the result of calling Date.now().

You provided: ${JSON.stringify(timestamp, null, 2)}, which is of type '${typeof timestamp}'.

You are likely seeing this error because 'createCaptureMiddleware' was not set up properly, or because you're making a custom Capture module and it isn't conforming to the specification.
`;

export const persistedCassetteInvalidActions = actions => `
Redux VCR error:
You tried to persist a cassette without an 'actions' array.

Cassettes need an array of actions.

You provided: ${JSON.stringify(actions, null, 2)}, which is of type '${typeof actions}'.

You are likely seeing this error because 'createCaptureMiddleware' was not set up properly, or because you're making a custom Capture module and it isn't conforming to the specification.
`;

export const persistedBeforeAuthentication = () => `
Redux VCR error:
You tried to persist a cassette before firebase authentication is complete.

All users need to be anonymously authenticated; this is how we ensure that a user can only update their own slice of the Firebase state, and they can't overwrite the actions of another user.

Authentication usually happens quite fast, and so the solution is to debounce your persist requests by a few hundred milliseconds.

If that solution fails, it is possible that your Firebase credentials are invalid.
`;



// /////////////////////// //
// /////// RETRIEVE ///// //
// ///////////////////// //
export const noCassettesFound = () => `
Redux VCR error:
You tried to view a list of cassettes, but no cassettes were found.

The most likely explanation is that there simply aren't any recorded sessions.

Alternatively, it could mean that the cassettes aren't where the retrieveHandler was looking for them. This could be the case if you're using a custom Persist module.
`;

export const permissionDenied = () => `
Redux VCR error:
You do not have permission to request cassettes.

The likely cause is that you haven't set up the rules in Firebase correctly, or you're authenticating using the wrong GitHub account.

For information on setting up Firebase, read the documentation:
https://github.com/joshwcomeau/redux-vcr/blob/master/documentation/firebase-config.md
`;


// /////////////////////// //
// /////// REPLAY /////// //
// ///////////////////// //
export const playWithNoCassetteSelected = () => `
Redux VCR error:
You tried to 'play' without any cassette selected.

Before clicking 'play', ensure that a cassette has been loaded.

If you are seeing this error, it likely means you are building a custom 'replay' module, and need to validate that a cassette is loaded before sending the PLAY_CASSETTE action.

If you are not using any custom VCR modules, you've likely found a bug with ReduxVCR.replay.
`;

export const playWithInvalidCassetteSelected = (selected, byId) => `
Redux VCR error:
You tried to 'play' with an invalid cassette selected.

If you are seeing this error, it likely means you are building a custom 'replay' module, and need to validate that a cassette ID is valid before attempting to play it.

If you are not using any custom VCR modules, you've likely found a bug with ReduxVCR.replay.

The cassette you attempted to play had the ID ${selected}. The available IDs are:
${Object.keys(byId).join(', ')}.
`;



// /////////////////////// //
// /////// SHARED /////// //
// ///////////////////// //
export const invalidFirebaseAuth = firebaseAuth => `
Redux VCR error:
You supplied an invalid 'firebaseAuth' object.

You provided: ${JSON.stringify(firebaseAuth, null, 2)}

To access the data in Firebase, we need:
  - an 'apiKey'
  - an 'authDomain'
  - a 'databaseURL'

These fields should all be strings.
`;

export const firebaseHandlerMissingSource = () => `
Redux VCR error:
You did not supply a valid 'source' when instantiating Firebase.

This can be any string, and is used to namespace the Firebase connection.
You probably want it to be either 'persist' or 'retrieve'.

If you are not creating custom Persist or Retrieve modules, you should not be seeing this error message; if you are, it means there's an issue with your configuration, or a bug in Redux VCR.
`;

export const firebaseHandlerInvalidProvider = provider => `
Redux VCR error:
You tried to sign in using an invalid 'provider'.

At this time, Redux VCR only accepts 'github.com', although we may add more providers in the future.

You provided: ${provider}.
`;
