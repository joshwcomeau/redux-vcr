/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import omit from 'lodash';

import DataHandler from '../src';
import firebaseStub from './firebase-stub';

DataHandler.replaceFirebase(firebaseStub);

const firebaseAuth = {
  apiKey: 'abc123',
  authDomain: 'test.firebaseapp.com',
  databaseURL: 'https://test.firebaseio.com',
};


describe('DataHandler', () => {
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
      expect(() => new DataHandler()).to.throw(/firebaseAuth/);
    });

    // Check that all 3 firebase keys are required
    Object.keys(firebaseAuth).forEach(missingKey => {
      const inadequateFirebaseAuth = omit(firebaseAuth, missingKey);

      it(`fails when firebaseAuth is missing ${missingKey}`, () => {
        const auth = {
          firebaseAuth: inadequateFirebaseAuth,
        };

        expect(() => (
          new DataHandler({ firebaseAuth: auth })
        )).to.throw(/firebaseAuth/);
      });
    });

    context('with a valid firebaseAuth object', () => {
      let handler;

      beforeEach(() => {
        handler = new DataHandler({ firebaseAuth });
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
        // This happens asynchronously, since we need to wait for Firebase
        // to generate the ID.
        expect(handler.sessionId).to.be.undefined;

        window.setTimeout(() => {
          expect(handler.sessionId).to.equal('abc123');
          done();
        }, 100);
      });

      it('captures the sessionStart timestamp', () => {
        expect(handler.sessionStart).to.be.a('number');
        expect(handler.sessionStart).to.be.closeTo(Date.now(), 1000);
      });
    });
  });


  describe('persist', () => {
    describe('authentication', () => {
      it('fails when invoked immediately', () => {
        // This test fails because the constructor needs some time
        // to authenticate with firebase.
        const handler = new DataHandler({
          firebaseAuth,
        });

        const casette = { data: {}, actions: [] };

        expect(() => handler.persist(casette)).to.throw(/firebase/);
      });

      it('succeeds when a debounce is used', done => {
        const handler = new DataHandler({
          firebaseAuth,
          debounceLength: 50,
        });

        const casette = { data: {}, actions: [] };

        // This is a little tricky, since the `persist` method is
        // debounced. The function will return just fine, even if
        // there's a problem with the auth.
        handler.persist(casette);

        expect(firebaseStub.set.callCount).to.equal(0);

        // Because of that, we also need to wait and see if .set
        // is called, which is the actual firebase-persist method.
        window.setTimeout(() => {
          // Called twice. Once for the casette, once for its actions.
          expect(firebaseStub.set.callCount).to.equal(2);

          done();
        }, 1000);
      });
    });

    describe('casette validation', () => {
      let handler;
      before(done => {
        handler = new DataHandler({ firebaseAuth });
        window.setTimeout(done, 100);
      });

      it('fails when no casette is provided', () => {
        expect(handler.persist).to.throw(/casette/);
      });

      it('fails when no action array is provided', () => {
        const faultyCasette = {};

        expect(() => (
          handler.persist(faultyCasette)
        )).to.throw(/casette/);
      });

      it('succeeds when the actions array is empty', () => {
        const casette = { actions: [] };
        expect(() => handler.persist(casette)).to.not.throw();
      });

      it('succeeds when no data is provided (it is optional)', () => {
        const casette = { actions: [{ type: 'STUFF' }] };

        expect(() => handler.persist(casette)).to.not.throw();
      });
    });

    describe('firebase integration', () => {
      let handler;
      const casette = {
        data: { label: "Josh's great session" },
        actions: [{ type: 'DO_GREAT_THINGS' }],
      };

      beforeEach(done => {
        handler = new DataHandler({ firebaseAuth });

        window.setTimeout(() => {
          handler.persist(casette);
          done();
        }, 50);
      });

      it('gets a database reference', () => {
        expect(firebaseStub.database.callCount).to.equal(1);
      });

      it('gets the ref for the casettes and actions paths', () => {
        expect(firebaseStub.ref.callCount).to.equal(2);

        const casettesRef = firebaseStub.ref.args[0][0];
        expect(casettesRef).to.equal('casettes/abc123');

        const actionsRef = firebaseStub.ref.args[1][0];
        expect(actionsRef).to.equal('actions/abc123');
      });

      it('sets the casette and the actions', () => {
        const set = firebaseStub.set;
        expect(set.callCount).to.equal(2);
      });

      it('passes along the right data for the casette', () => {
        const setCasette = firebaseStub.set.args[0][0];

        expect(setCasette.data).to.equal(casette.data);
        expect(setCasette.timestamp).to.be.a('number');
        expect(setCasette.numOfActions).to.equal(casette.actions.length);
      });

      it('passes along the actions as-is', () => {
        const setActions = firebaseStub.set.args[1][0];

        expect(setActions).to.equal(casette.actions);
      });
    });

    describe('debounce timing', () => {
      it('debounces the persist method when set', done => {
        // In this test, we'll invoke `persist` several times very quickly,
        // and check to see that:
        //   - it isn't invoked at all right away
        //   - it is only invoked once, at the end of the debounce.
        const handler = new DataHandler({
          firebaseAuth,
          debounceLength: 200,
        });
        const casette = { actions: [{ type: 'JUMP_OVER_BARN' }] };

        for (let i = 0; i <= 5; i++) {
          handler.persist(casette);
        }

        expect(firebaseStub.database.callCount).to.equal(0);

        window.setTimeout(() => {
          expect(firebaseStub.database.callCount).to.equal(1);
          done();
        }, 250);
      });
    });
  });
});
