/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import { createPersistHandler } from '../src';

const firebaseAuth = {
  apiKey: 'abc123',
  authDomain: 'test.firebaseapp.com',
  databaseURL: 'https://test.firebaseio.com',
};


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('createPersistHandler', () => {
  describe('anonymous authentication', () => {
    it('fails when invoked immediately', () => {
      // This test fails because the constructor needs some time
      // to authenticate with firebase.
      const handler = createPersistHandler({
        firebaseAuth,
      });

      const cassette = { data: {}, actions: [] };

      expect(() => handler.persist(cassette)).to.throw(/firebase/);
    });

    it('succeeds when a pause is alloted for authentication', async function(done) {
      const handler = createPersistHandler({
        firebaseAuth,
        debounceLength: 50,
      });

      const cassette = { data: {}, actions: [] };

      const firebase = handler.firebaseHandler.firebase;

      // This is a little tricky, since the `persist` method is debounced.
      // The function will return just fine, even if there's a problem
      // with the auth.
      expect(firebase.set.callCount).to.equal(0);

      await delay(100);

      handler.persist(cassette);

      await delay(100);

      expect(firebase.set.callCount).to.equal(2);

      done();
    });
  });

  describe('cassette validation', () => {
    let handler;
    before(done => {
      handler = createPersistHandler({ firebaseAuth });
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

    beforeEach(async function(done) {
      handler = createPersistHandler({ firebaseAuth });
      firebase = handler.firebaseHandler.firebase;

      await delay(200);

      handler.persist(cassette);

      await delay(200);

      done();
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
    let handler;
    let firebase;
    const cassette = {
      data: { label: "Josh's great session" },
      actions: [{ type: 'DO_GREAT_THINGS' }],
    };

    beforeEach(done => {
      handler = createPersistHandler({ firebaseAuth });
      firebase = handler.firebaseHandler.firebase;

      window.setTimeout(done, 200);
    });

    it('debounces the persist method when set', done => {
      // In this test, we'll invoke `persist` several times very quickly,
      // and check to see that:
      //   - it isn't invoked at all right away
      //   - it is only invoked once, at the end of the debounce.
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
