
let stateChangeCallback;

export default {
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
};
