import { expect } from 'chai';
import sinon from 'sinon';
import omit from 'lodash';

import dataHandler from '../src';
import firebaseStub from './firebase-stub';

dataHandler.replaceFirebase(firebaseStub);

const firebaseAuth = {
  apiKey: 'abc123',
  authDomain: 'test.firebaseapp.com',
  databaseURL: 'https://test.firebaseio.com',
};


describe('persist dataHandler', () => {
  before(() => {
    Object.keys(firebaseStub).forEach(key => {
      sinon.spy(firebaseStub, key);
    });
  });

  afterEach(() => {
    Object.keys(firebaseStub).forEach(key => {
      firebaseStub[key].reset();
    });
  });

  after(() => {
    Object.keys(firebaseStub).forEach(key => {
      firebaseStub[key].restore();
    });
  });

  describe('initialization', () => {
    it('throws when no arguments are provided', () => {
      expect(dataHandler.initialize).to.throw(/firebaseAuth/);
    });

    // Check that all 3 firebase keys are required
    Object.keys(firebaseAuth).forEach(missingKey => {
      const inadequateFirebaseAuth = omit(firebaseAuth, missingKey);

      it(`fails when firebaseAuth is missing ${missingKey}`, () => {
        const init = () => {
          dataHandler.initialize({
            firebaseAuth: inadequateFirebaseAuth,
          });
        };

        expect(init).to.throw(/firebaseAuth/);
      });
    });

    context('with a valid firebaseAuth object', () => {
      beforeEach(() => {
        dataHandler.initialize({ firebaseAuth });
      });

      it('invokes `initializeApp` with the supplied auth', () => {
        expect(firebaseStub.initializeApp.callCount).to.equal(1);

        const call = firebaseStub.initializeApp.getCall(0);
        expect(call.args[0]).to.equal(firebaseAuth);
      });

      it('invokes `auth` once to retrieve auth methods', () => {
        expect(firebaseStub.auth.callCount).to.equal(1);
      });

      it('invokes the `signInAnonymously` method', () => {
        expect(firebaseStub.signInAnonymously.callCount).to.equal(1);
      });

      it('registers the `onAuthStateChanged` callback', () => {
        expect(firebaseStub.onAuthStateChanged.callCount).to.equal(1);
      });

      it('sets the session ID', done => {
        // This happens asynchronously, since we need to wait for Firebase to generate the ID.
        window.setTimeout(() => {
          expect(dataHandler.sessionId).to.equal('abc123');
          done();
        }, 100);
      });
    });
  });
});
