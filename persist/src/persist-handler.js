import debounce from 'lodash.debounce';
import invariant from 'invariant';

import './polyfills';

const useLocal = process.env.NODE_ENV === 'development';
const { FirebaseHandler } = useLocal
  ? require('../../shared/src')
  : require('redux-vcr.shared');


export default class PersistHandler {
  constructor({ firebaseAuth, debounceLength }) {
    // Create a Firebase handler
    this.firebaseHandler = new FirebaseHandler({
      firebaseAuth,
      source: 'persist',
    });

    this.sessionStart = Date.now();

    // Debounce our `persist` method, to avoid spamming firebase whenever
    // a small change happens
    if (debounceLength) {
      this.persist = debounce(this.persist, debounceLength);
    }
  }

  persist(cassette) {
    invariant(
      typeof cassette === 'object' &&
      Array.isArray(cassette.actions),
      `Please supply a valid 'cassette' when invoking PersistHandler.persist.

      A valid cassette is an object containing an optional 'data' argument,
      and a required array of 'actions'.

      For more information, see PLACEHOLDER.
      `
    );

    const { sessionId } = this.firebaseHandler;
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
    const database = this.firebaseHandler.firebase.database();

    // Store our cassettes separately from our cassette actions.
    // There are performance reasons for this: by keeping our /cassettes
    // light, they can easily be sorted or filtered on the client.
    database.ref(`cassettes/${sessionId}`).set({
      data,
      timestamp: this.sessionStart,
      numOfActions: actions.length,
    });

    database.ref(`actions/${sessionId}`).set(actions);
  }
}
