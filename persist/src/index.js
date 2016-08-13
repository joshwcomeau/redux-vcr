import debounce from 'lodash.debounce';
import invariant from 'invariant';
import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';
import './polyfills';


export default class DataHandler {
  constructor({ firebaseAuth, debounceLength }) {
    // Validate the firebaseAuth object
    invariant(
      typeof firebaseAuth === 'object' &&
      typeof firebaseAuth.apiKey === 'string' &&
      typeof firebaseAuth.authDomain === 'string' &&
      typeof firebaseAuth.databaseURL === 'string',
      `Please supply a valid 'firebaseAuth' object to ReduxVCR/persist.

      To persist data to firebase, we need an 'apiKey', an 'authDomain',
      and a 'databaseUrl'.

      For more information, see PLACEHOLDER.`
    );

    // Either use the firebase override set on the class (stubbed for
    // testing), or the default imported firebase.
    this.firebase = DataHandler.firebase || firebase;

    this.firebase.initializeApp(firebaseAuth);

    const auth = this.firebase.auth();

    auth.signInAnonymously();

    auth.onAuthStateChanged(session => {
      this.sessionId = session.uid;
    });

    this.sessionStart = Date.now();

    // Debounce our `persist` method, to avoid spamming firebase whenever
    // a small change happens
    if (debounceLength) {
      this.persist = debounce(this.persist, debounceLength);
    }
  }

  persist(casette) {
    invariant(
      typeof casette === 'object' &&
      Array.isArray(casette.actions),
      `Please supply a valid 'casette' when invoking DataHandler.persist.

      A valid casette is an object containing an optional 'data' argument,
      and a required array of 'actions'.

      For more information, see PLACEHOLDER.
      `
    );

    const { data = {}, actions } = casette;
    const database = this.firebase.database();

    invariant(
      typeof this.sessionId !== 'undefined',
      `It seems you're trying to persist a casette before firebase
      authentication is complete.

      Either this means that you're persisting too quickly, or there's
      a problem with firebase authentication.

      Ensure that your credentials are valid, and that you're debouncing
      all persist requests.

      For more information, see PLACEHOLDER.`
    );

    // For efficiency, we want our firebase structure to look like:
    /*
      {
        casettes: {
          abc123: { timestamp: 123456789, numOfActions: 200 },
          xyz789: { ... }
        ],
        actions: {
          abc123: [
            {
              time: 100,
              action: {
                // Redux action
                type: 'DO_THING',
                payload: { ... }
              }
            }
          ],
          xyz789: [ ... ],
        },
      }
    */

    database.ref(`casettes/${this.sessionId}`).set({
      data,
      timestamp: this.sessionStart,
      numOfActions: actions.length,
    });

    database.ref(`actions/${this.sessionId}`).set(actions);
  }

  // Allow firebase to be replaced externally.
  // While this seems like a terrible idea, it's the only way I've found
  // to be able to stub this private module; libs like `rewire` have
  // trouble with ES6/webpack.
  static replaceFirebase(newBase) {
    if (process.env.NODE_ENV === 'test') {
      this.firebase = newBase;
    }
  }
}
