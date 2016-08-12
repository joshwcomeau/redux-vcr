module.exports = {
  testProp: 5,
  initializeApp() {},
  auth() {
    return {
      signInAnonymously() {},
      onAuthStateChanged(callback) {
        const user = { uid: 'abc123' };
        callback(user);
      },
    };
  },
  database() {
    return {
      ref() {
        return {
          set() {},
        };
      },
    };
  },
};
