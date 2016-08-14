/* eslint-disable global-require */
import invariant from 'invariant';

let firebase;
let firebaseStubFactory;
if (process.env.NODE_ENV === 'test') {
  firebaseStubFactory = require('./firebase-stub-factory');
} else {
  firebase = require('firebase/app');
  require('firebase/auth');
  require('firebase/database');
}

export default class FirebaseHandler {
  constructor({ firebaseAuth, source }) {
    // Validate the firebaseAuth object
    invariant(
      typeof firebaseAuth === 'object' &&
      typeof firebaseAuth.apiKey === 'string' &&
      typeof firebaseAuth.authDomain === 'string' &&
      typeof firebaseAuth.databaseURL === 'string',
      `Please supply a valid 'firebaseAuth' object to ReduxVCR's firebaseHandler.

      To persist data to firebase, we need an 'apiKey', an 'authDomain',
      and a 'databaseUrl'.

      For more information, see PLACEHOLDER.`
    );

    // Ensure we're given a 'source' (typically either 'persist' or 'retrieve')
    invariant(
      typeof source === 'string',
      `Please supply a 'source' when instantiating FirebaseHandler.

      This can be any string, and is used to namespace the Firebase connection.
      You probably want it to be either 'persist' or 'retrieve'.

      For more information, see PLACEHOLDER.`
    );

    // If we're running in test mode, we want to generate a fresh stub.
    if (process.env.NODE_ENV === 'test') {
      firebase = firebaseStubFactory();
    }

    this.firebaseConnection = firebase.initializeApp(firebaseAuth, source);

    const auth = this.firebaseConnection.auth();

    auth.signInAnonymously();

    auth.onAuthStateChanged(session => {
      this.firebaseSessionId = session.uid;
    });
  }

  get sessionId() {
    return this.firebaseSessionId;
  }

  get firebase() {
    // Normally, we wouldn't want to expose an internal module like this.
    // However, the entire FirebaseHandler class is itself an internal module.
    // Because access to FirebaseHandler is so limited, I feel alright.
    return this.firebaseConnection;
  }
}
