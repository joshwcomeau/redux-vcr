import FirebaseHandler from '../../shared/utils/firebase-handler';


export default class RetrieveDataHandler {
  constructor({ firebaseAuth }) {
    // Create a Firebase handler
    this.firebaseHandler = new FirebaseHandler({ firebaseAuth });
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
