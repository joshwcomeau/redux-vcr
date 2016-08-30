/* eslint-disable global-require */
import invariant from 'invariant';

import { errors } from '../index';

let firebase;
let firebaseStubFactory;
if (process.env.NODE_ENV === 'test') {
  firebaseStubFactory = require('../stubs/firebase-stub-factory');
} else {
  firebase = require('firebase/app');
  require('firebase/auth');
  require('firebase/database');
}


export default function createFirebaseHandler({ firebaseAuth, source }) {
  // Validate the firebaseAuth object
  invariant(
    typeof firebaseAuth === 'object' &&
    typeof firebaseAuth.apiKey === 'string' &&
    typeof firebaseAuth.authDomain === 'string' &&
    typeof firebaseAuth.databaseURL === 'string',
    errors.invalidFirebaseAuth(firebaseAuth)
  );

  // Ensure we're given a 'source' (typically either 'persist' or 'retrieve')
  invariant(
    typeof source === 'string',
    errors.firebaseHandlerMissingSource()
  );

  // If we're running in test mode, we want to generate a fresh stub.
  if (process.env.NODE_ENV === 'test') {
    firebase = firebaseStubFactory();
  }

  const firebaseHandler = {
    firebaseConnection: firebase.initializeApp(firebaseAuth, source),
    initialize() {
      const auth = this.firebaseConnection.auth();

      // For retrieval, we want to send github-authenticated requests.
      // For persist, though, we can use anonymous authentication.
      if (source === 'persist') {
        auth.signInAnonymously();
      }

      auth.onAuthStateChanged(user => {
        this.firebaseUser = user;
        this.firebaseSessionId = user.uid;
      });
    },
    createProvider(provider) {
      invariant(
        provider === 'github.com',
        errors.firebaseHandlerInvalidProvider(provider)
      );

      switch (provider) {
        case 'github.com': return new firebase.auth.GithubAuthProvider();

        // the default case should never actually be hit. It's a fallback in case
        // the invariant above misses something.
        default: throw new Error('Please supply a valid provider');
      }
    },

    buildCredential({ accessToken, provider }) {
      invariant(
        provider === 'github.com',
        errors.firebaseHandlerInvalidProvider(provider)
      );

      switch (provider) {
        case 'github.com':
          return firebase.auth.GithubAuthProvider.credential(accessToken);

        // the default case should never actually be hit. It's a fallback in case
        // the invariant above misses something.
        default: throw new Error('Please supply a valid provider');
      }
    },

    get sessionId() {
      return this.firebaseSessionId;
    },

    get user() {
      return this.firebaseUser;
    },

    get firebase() {
      // Normally, we wouldn't want to expose an internal module like this.
      // However, the entire firebaseHandler object is itself an internal module.
      // Because access to firebaseHandler is so limited, I feel alright with it.
      return this.firebaseConnection;
    },
  };

  firebaseHandler.initialize();

  return firebaseHandler;
}
