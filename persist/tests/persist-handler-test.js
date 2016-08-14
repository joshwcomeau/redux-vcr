/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import { PersistHandler } from '../src';

const firebaseAuth = {
  apiKey: 'abc123',
  authDomain: 'test.firebaseapp.com',
  databaseURL: 'https://test.firebaseio.com',
};


describe('PersistHandler', () => {
  describe('authentication', () => {
    it('fails when invoked immediately', () => {
      // This test fails because the constructor needs some time
      // to authenticate with firebase.
      const handler = new PersistHandler({
        firebaseAuth,
      });

      const cassette = { data: {}, actions: [] };

      expect(() => handler.persist(cassette)).to.throw(/firebase/);
    });

    it('succeeds when a debounce is used', done => {
      const handler = new PersistHandler({
        firebaseAuth,
        debounceLength: 50,
      });

      const cassette = { data: {}, actions: [] };

      const firebase = handler.firebaseHandler.firebase;

      // This is a little tricky, since the `persist` method is debounced.
      // The function will return just fine, even if there's a problem
      // with the auth.
      handler.persist(cassette);

      expect(firebase.set.callCount).to.equal(0);

      // Because of that, we also need to wait and see if .set
      // is called, which is the actual firebase-persist method.
      window.setTimeout(() => {
        // Called twice. Once for the cassette, once for its actions.
        expect(firebase.set.callCount).to.equal(2);

        done();
      }, 1000);
    });
  });

  describe('cassette validation', () => {
    let handler;
    before(done => {
      handler = new PersistHandler({ firebaseAuth });
      window.setTimeout(done, 100);
    });

    it('fails when no cassette is provided', () => {
      expect(handler.persist).to.throw(/cassette/);
    });

    it('fails when no action array is provided', () => {
      const faultyCassette = {};

      expect(() => (
        handler.persist(faultyCassette)
      )).to.throw(/cassette/);
    });

    it('succeeds when the actions array is empty', () => {
      const cassette = { actions: [] };
      expect(() => handler.persist(cassette)).to.not.throw();
    });

    it('succeeds when no data is provided (it is optional)', () => {
      const cassette = { actions: [{ type: 'STUFF' }] };

      expect(() => handler.persist(cassette)).to.not.throw();
    });
  });

  describe('firebase integration', () => {
    let handler;
    let firebase;
    const cassette = {
      data: { label: "Josh's great session" },
      actions: [{ type: 'DO_GREAT_THINGS' }],
    };

    beforeEach(done => {
      handler = new PersistHandler({ firebaseAuth });
      firebase = handler.firebaseHandler.firebase;

      window.setTimeout(() => {
        handler.persist(cassette);
        done();
      }, 50);
    });

    it('gets a database reference', () => {
      expect(firebase.database.callCount).to.equal(1);
    });

    it('gets the ref for the cassettes and actions paths', () => {
      expect(firebase.ref.callCount).to.equal(2);

      const cassettesRef = firebase.ref.args[0][0];
      expect(cassettesRef).to.equal('cassettes/abc123');

      const actionsRef = firebase.ref.args[1][0];
      expect(actionsRef).to.equal('actions/abc123');
    });

    it('sets the cassette and the actions', () => {
      const set = firebase.set;
      expect(set.callCount).to.equal(2);
    });

    it('passes along the right data for the cassette', () => {
      const setCassette = firebase.set.args[0][0];

      expect(setCassette.data).to.equal(cassette.data);
      expect(setCassette.timestamp).to.be.a('number');
      expect(setCassette.numOfActions).to.equal(cassette.actions.length);
    });

    it('passes along the actions as-is', () => {
      const setActions = firebase.set.args[1][0];

      expect(setActions).to.equal(cassette.actions);
    });
  });

  describe('debounce timing', () => {
    it('debounces the persist method when set', done => {
      // In this test, we'll invoke `persist` several times very quickly,
      // and check to see that:
      //   - it isn't invoked at all right away
      //   - it is only invoked once, at the end of the debounce.
      const handler = new PersistHandler({
        firebaseAuth,
        debounceLength: 200,
      });
      const firebase = handler.firebaseHandler.firebase;
      const cassette = { actions: [{ type: 'JUMP_OVER_BARN' }] };

      for (let i = 0; i <= 5; i++) {
        handler.persist(cassette);
      }

      expect(firebase.database.callCount).to.equal(0);

      window.setTimeout(() => {
        expect(firebase.database.callCount).to.equal(1);
        done();
      }, 250);
    });
  });
});
