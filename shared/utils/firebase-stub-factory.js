import sinon from 'sinon';

let stateChangeCallback;

const firebaseStubFactory = () => {
  const firebaseStub = {
    initializeApp() {},

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

    onAuthStateChanged(callback) {
      stateChangeCallback = callback;
    },

    ref() {
      return this;
    },

    set() {},

    once() {},
  };

  sinon.spy(firebaseStub, 'initializeApp');
  sinon.spy(firebaseStub, 'auth');
  sinon.spy(firebaseStub, 'database');
  sinon.spy(firebaseStub, 'signInAnonymously');
  sinon.spy(firebaseStub, 'onAuthStateChanged');
  sinon.spy(firebaseStub, 'ref');
  sinon.spy(firebaseStub, 'set');
  sinon.spy(firebaseStub, 'once');

  return firebaseStub;
};


export default firebaseStubFactory;
