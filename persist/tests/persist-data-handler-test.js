import { expect } from 'chai';
import sinon from 'sinon';
import omit from 'lodash';

import dataHandler from '../src';
import firebaseStub from './firebase-stub';

dataHandler.newFirebase = firebaseStub;

const firebaseAuth = {
  apiKey: 'abc123',
  authDomain: 'test.firebaseapp.com',
  databaseURL: 'https://test.firebaseio.com',
};


describe('persist dataHandler', () => {
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
  });
});
