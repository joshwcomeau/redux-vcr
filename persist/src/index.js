import debounce from 'lodash.debounce';
import invariant from 'invariant';
import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';


const sessionStart = Date.now();
let user = {};


export default {
  // Allow firebase to be replaced externally.
  // While this seems like a terrible idea, it's the only way I've found
  // to be able to stub this private module; libs like `rewire` have
  // trouble with ES6/webpack.
  replaceFirebase(newBase) {
    if (process.env.NODE_ENV === 'test') {
      this.firebase = newBase;
    }
  },

  initialize({ firebaseAuth, debounceLength = 500 } = {}) {
    // Validate the firebaseAuth object
    invariant(
      typeof firebaseAuth === 'object' &&
      typeof firebaseAuth.apiKey === 'string' &&
      typeof firebaseAuth.authDomain === 'string' &&
      typeof firebaseAuth.databaseUrl === 'string',
      `Please supply a valid 'firebaseAuth' object to ReduxVCR/persist.

      To persist data to firebase, we need an 'apiKey', an 'authDomain',
      and a 'databaseUrl'.

      For more information, see PLACEHOLDER.`
    );

    // Default firebase to use the official SDK.
    if (typeof this.firebase === 'undefined') {
      this.firebase = firebase;
    }

    this.firebase.initializeApp(firebaseAuth);

    // Sign the user in anonymously.
    this.firebase.auth().signInAnonymously();

    this.firebase.auth().onAuthStateChanged(u => {
      user = u;
    });

    // Debounce our `persist` method, to avoid spamming firebase whenever
    // a small change happens
    if (debounceLength) {
      this.persist = debounce(this.persist, debounceLength);
    }
  },

  persist(casette) {
    const { data, actions } = casette;
    const sessionId = user.uid;
    const database = this.firebase.database();

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

    database.ref(`casettes/${sessionId}`).set({
      data,
      timestamp: sessionStart,
      numOfActions: actions.length,
    });

    database.ref(`actions/${sessionId}`).set(actions);
  },
};
