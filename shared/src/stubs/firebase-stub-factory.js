import sinon from 'sinon';

let stateChangeCallback;

const firebaseStubFactory = () => {
  const firebaseStub = {
    initializeApp() {
      return this;
    },

    auth() {
      return this;
    },

    database() {
      return this;
    },

    signInAnonymously() {
      // asynchronously invoke the authStateChanged callback
      const session = { uid: 'abc123' };
      window.setTimeout(() => {
        stateChangeCallback(session);
      }, 10);
    },

    signInWithPopup(provider) {
      return new Promise((resolve) => {
        resolve({
          user: {},
          credential: {},
        });
      });
    },


    onAuthStateChanged(callback) {
      stateChangeCallback = callback;
    },

    ref() {
      return this;
    },

    set() {},

    once() {
      return new Promise((resolve) => {
        resolve({
          val() {
            return [{ id: 'cassette1' }];
          },
        });
      });
    },
  };

  firebaseStub.auth.GithubAuthProvider = () => {
    return {};
  };

  sinon.spy(firebaseStub, 'initializeApp');
  sinon.spy(firebaseStub, 'auth');
  sinon.spy(firebaseStub, 'database');
  sinon.spy(firebaseStub, 'signInAnonymously');
  sinon.spy(firebaseStub, 'onAuthStateChanged');
  sinon.spy(firebaseStub, 'ref');
  sinon.spy(firebaseStub, 'set');
  sinon.spy(firebaseStub, 'once');
  sinon.spy(firebaseStub.auth, 'GithubAuthProvider');

  return firebaseStub;
};


export default firebaseStubFactory;
