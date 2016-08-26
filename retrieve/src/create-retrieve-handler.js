import { createFirebaseHandler } from './shared-resolver';


export default function createRetrieveHandler({ firebaseAuth }) {
  const firebaseHandler = createFirebaseHandler({
    firebaseAuth,
    source: 'retrieve',
  });

  return {
    // Authenticate developers with a specified provider source
    // returns a promise, that the middleware can use to dispatch whichever action
    // (success or failure) is appropriate.
    signInWithPopup(authMethod) {
      const provider = firebaseHandler.createProvider(authMethod);

      return firebaseHandler
        .firebase
        .auth()
        .signInWithPopup(provider);
    },

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
