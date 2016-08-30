import { createFirebaseHandler } from 'redux-vcr.shared';


export default function createRetrieveHandler({ firebaseAuth }) {
  const firebaseHandler = createFirebaseHandler({
    firebaseAuth,
    source: 'retrieve',
  });

  return {
    // Authenticate developers with a specified provider source
    // returns a promise, that the middleware can use to dispatch whichever
    // action (success or failure) is appropriate.
    signInWithPopup(authMethod) {
      const provider = firebaseHandler.createProvider(authMethod);

      return firebaseHandler
        .firebase
        .auth()
        .signInWithPopup(provider);
    },

    // Sign in using a saved credential.
    // This allows "remember me" functionality. Once a developer has
    // authenticated with `signInWithPopup`, we store the access creds.
    // On load, we check for their existence, and sign in using this method:
    signInWithCredential(rawCredential) {
      const credential = firebaseHandler.buildCredential(rawCredential);

      return firebaseHandler
        .firebase
        .auth()
        .signInWithCredential(credential);
    },

    signOut() {
      return firebaseHandler
        .firebase
        .auth()
        .signOut();
    },

    retrieveList() {
      return firebaseHandler
        .firebase
        .database()
        .ref('cassettes')
        .once('value');
    },

    retrieveActions({ id }) {
      return firebaseHandler
        .firebase
        .database()
        .ref(`actions/${id}`)
        .once('value');
    },

    firebaseHandler,
  };
}
