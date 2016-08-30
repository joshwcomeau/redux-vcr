// ////// CAPTURE ////// //


// ////// PERSIST ////// //
export const persistedCassetteNotAnObject = `
Redux VCR error:
You tried to persist an invalid or nonexistent cassette.

Cassettes should be objects with a timestamp, an array of actions,
and an optional 'data' object with cassette metadata.

You are likely seeing this error because 'createCaptureMiddleware'
was not set up properly, or because you're making a custom Capture
module and it isn't conforming to the specification.

For more information, see PLACEHOLDER.
`;

export const persistedCassetteInvalidTimestamp = `
Redux VCR error:
You tried to persist a cassette without a valid 'timestamp'.

Cassettes need a numeric timestamp, eg. the result of calling
Date.now().

You are likely seeing this error because 'createCaptureMiddleware'
was not set up properly, or because you're making a custom Capture
module and it isn't conforming to the specification.

For more information, see PLACEHOLDER.
`;

export const persistedCassetteInvalidActions = `
Redux VCR error:
You tried to persist a cassette without an 'actions' array.

Actions are the primary purpose of a cassette. Because it doesn't
make much sense to persist a cassette without an 'actions' array,
this is probably an error with 'createCaptureMiddleware', or a
custom Capture module.

For more information, see PLACEHOLDER.
`;

export const persistedBeforeAuthentication = `
It seems you're trying to persist a cassette before firebase
authentication is complete.

Either this means that you're persisting too quickly, or there's
a problem with firebase authentication.

Ensure that your credentials are valid, and that you're debouncing
all persist requests.

For more information, see PLACEHOLDER.
`;
