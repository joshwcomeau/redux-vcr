/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import { createRetrieveHandler } from '../src';

const firebaseAuth = {
  apiKey: 'abc123',
  authDomain: 'test.firebaseapp.com',
  databaseURL: 'https://test.firebaseio.com',
};

describe('RetrieveHandler', () => {
  describe('retrieveList', () => {
    let handler;
    let firebase;
    beforeEach(() => {
      handler = createRetrieveHandler({ firebaseAuth });
      firebase = handler.firebaseHandler.firebase;

      handler.retrieveList();
    });

    it('gets a database reference', () => {
      expect(firebase.database.callCount).to.equal(1);
    });

    it('gets the ref for the cassettes', () => {
      expect(firebase.ref.callCount).to.equal(1);

      const cassettesRef = firebase.ref.args[0][0];
      expect(cassettesRef).to.equal('cassettes');
    });

    it('calls "once" to receive a snapshot', () => {
      expect(firebase.once.callCount).to.equal(1);
      expect(firebase.once.firstCall.args[0]).to.equal('value');
    });
  });

  describe('retrieveActions', () => {
    let handler;
    let firebase;
    beforeEach(() => {
      handler = createRetrieveHandler({ firebaseAuth });
      firebase = handler.firebaseHandler.firebase;

      handler.retrieveActions({ id: '123' });
    });

    it('gets a database reference', () => {
      expect(firebase.database.callCount).to.equal(1);
    });

    it('gets the ref for the actions', () => {
      expect(firebase.ref.callCount).to.equal(1);

      const actionsRef = firebase.ref.args[0][0];
      expect(actionsRef).to.equal('actions/123');
    });

    it('calls "once" to receive a snapshot', () => {
      expect(firebase.once.callCount).to.equal(1);
      expect(firebase.once.firstCall.args[0]).to.equal('value');
    });
  });
});
