// import { FirebaseHandler } from 'redux-vcr.shared';
import { FirebaseHandler } from '../../shared/src';


export default class RetrieveHandler {
  constructor({ firebaseAuth }) {
    // Create a Firebase handler
    this.firebaseHandler = new FirebaseHandler({
      firebaseAuth,
      source: 'retrieve',
    });
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
