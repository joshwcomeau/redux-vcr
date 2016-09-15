/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import omit from 'lodash';

import createFirebaseHandler from '../src/utils/create-firebase-handler';

const firebaseAuth = {
  apiKey: 'abc123',
  authDomain: 'test.firebaseapp.com',
  databaseURL: 'https://test.firebaseio.com',
};

const source = 'persist';


describe('FirebaseHandler', () => {
  describe('initialization', () => {
    it('throws when no arguments are provided', () => {
      expect(() => createFirebaseHandler()).to.throw(/firebaseAuth/);
    });

    it('throws when no source is provided', () => {
      const config = { firebaseAuth };

      expect(() => createFirebaseHandler(config)).to.throw(/source/);
    });

    // Check that all 3 firebase keys are required
    Object.keys(firebaseAuth).forEach(missingKey => {
      const inadequateFirebaseAuth = omit(firebaseAuth, missingKey);

      it(`fails when firebaseAuth is missing ${missingKey}`, () => {
        const auth = {
          firebaseAuth: inadequateFirebaseAuth,
          source,
        };

        const genHandler = () => createFirebaseHandler(auth);
        expect(genHandler).to.throw(/firebaseAuth/);
      });
    });

    context('with a valid firebaseAuth object', () => {
      let handler;

      beforeEach(() => {
        handler = createFirebaseHandler({ firebaseAuth, source });
      });

      it('invokes `initializeApp` with the supplied auth', () => {
        expect(handler.firebase.initializeApp.callCount).to.equal(1);

        const call = handler.firebase.initializeApp.getCall(0);
        expect(call.args[0]).to.equal(firebaseAuth);
        expect(call.args[1]).to.equal(source);
      });

      it('invokes `auth` once to retrieve auth methods', () => {
        expect(handler.firebase.auth.callCount).to.equal(1);
      });

      it('invokes the `signInAnonymously` method', () => {
        expect(handler.firebase.signInAnonymously.callCount).to.equal(1);
      });

      it('registers the `onAuthStateChanged` callback', () => {
        expect(handler.firebase.onAuthStateChanged.callCount).to.equal(1);
      });

      it('sets the session ID', done => {
        // This happens asynchronously, since we need to wait for Firebase
        // to generate the ID.
        expect(handler.sessionId).to.be.undefined;

        setTimeout(() => {
          expect(handler.sessionId).to.equal('abc123');
          done();
        }, 100);
      });
    });
  });
});
