import { FirebaseHandler } from 'redux-vcr.shared';


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
  signIn(authMethod) {
    const provider = this.firebaseHandler.createProvider(authMethod);

    return this.firebaseHandler
      .firebase
      .auth()
      .signInWithPopup(provider);
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
