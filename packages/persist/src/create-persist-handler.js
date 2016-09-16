import debounce from 'lodash.debounce';
import invariant from 'invariant';

import { createFirebaseHandler, errors } from 'redux-vcr.shared';


export default function createPersistHandler({
  firebaseAuth,
  debounceLength = 0,
}) {
  const firebaseHandler = createFirebaseHandler({
    firebaseAuth,
    source: 'persist',
  });

  const debouncedPersist = debounce(cassette => {
    const { sessionId } = firebaseHandler;

    const { actions, ...cassetteData } = cassette;
    const database = firebaseHandler.firebase.database();

    // Store our cassettes separately from our cassette actions.
    // There are performance reasons for this: by keeping our /cassettes
    // light, they can easily be sorted or filtered on the client.
    database.ref(`cassettes/${sessionId}`).set({
      ...cassetteData,
      numOfActions: actions.length,
    });

    database.ref(`actions/${sessionId}`).set(actions);
  }, debounceLength);

  return {
    firebaseHandler,
    persist(cassette) {
      invariant(
        typeof cassette === 'object',
        errors.persistedCassetteNotAnObject(cassette)
      );

      invariant(
        typeof cassette.timestamp === 'number',
        errors.persistedCassetteInvalidTimestamp(cassette.timestamp)
      );

      invariant(
        Array.isArray(cassette.actions),
        errors.persistedCassetteInvalidActions(cassette.actions)
      );

      debouncedPersist(cassette);
    },
  };
}
