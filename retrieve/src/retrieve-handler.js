import useLocal from './use-local';

const { FirebaseHandler } = useLocal
  ? require('../../shared/src')
  : require('redux-vcr.shared');


export default class RetrieveHandler {
  constructor({ firebaseAuth }) {
    // Create a Firebase handler
    this.firebaseHandler = new FirebaseHandler({
      firebaseAuth,
      source: 'retrieve',
    });
  }

  // Authenticate developers with a specified provider source
  // returns a promise, that the middleware can use to dispatch whichever action
  // (success or failure) is appropriate.
  signInWithPopup(authMethod) {
    const provider = this.firebaseHandler.createProvider(authMethod);

    return this.firebaseHandler
      .firebase
      .auth()
      .signInWithPopup(provider);
  }

  signInWithCredential(rawCredential) {
    const credential = this.firebaseHandler.buildCredential(rawCredential);

    return this.firebaseHandler
      .firebase
      .auth()
      .signInWithCredential(credential);
  }

  signOut() {
    return this.firebaseHandler
      .firebase
      .auth()
      .signOut();
  }

  retrieveList() {
    return this.firebaseHandler
      .firebase
      .database()
      .ref('cassettes')
      .once('value');
  }

  retrieveActions({ id }) {
    return this.firebaseHandler
      .firebase
      .database()
      .ref(`actions/${id}`)
      .once('value');
  }
}
