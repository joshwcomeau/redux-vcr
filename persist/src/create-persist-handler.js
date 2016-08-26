import debounce from 'lodash.debounce';
import invariant from 'invariant';

import { FirebaseHandler } from './shared-resolver';
import './polyfills';


export default function createPersistHandler({
  firebaseAuth,
  debounceLength = 0,
}) {
  const firebaseHandler = new FirebaseHandler({
    firebaseAuth,
    source: 'persist',
  });

  const sessionStart = Date.now();

  return {
    persist: debounce(cassette => {
      invariant(
        typeof cassette === 'object' &&
        Array.isArray(cassette.actions),
        `Please supply a valid 'cassette' when invoking PersistHandler.persist.

        A valid cassette is an object containing an optional 'data' argument,
        and a required array of 'actions'.

        For more information, see PLACEHOLDER.
        `
      );

      const { sessionId } = firebaseHandler;
      invariant(
        typeof sessionId !== 'undefined',
        `It seems you're trying to persist a cassette before firebase
        authentication is complete.

        Either this means that you're persisting too quickly, or there's
        a problem with firebase authentication.

        Ensure that your credentials are valid, and that you're debouncing
        all persist requests.

        For more information, see PLACEHOLDER.`
      );

      const { data = {}, actions } = cassette;
      const database = firebaseHandler.firebase.database();

      // Store our cassettes separately from our cassette actions.
      // There are performance reasons for this: by keeping our /cassettes
      // light, they can easily be sorted or filtered on the client.
      database.ref(`cassettes/${sessionId}`).set({
        data,
        timestamp: sessionStart,
        numOfActions: actions.length,
      });

      database.ref(`actions/${sessionId}`).set(actions);
    }, debounceLength),
  };
}
