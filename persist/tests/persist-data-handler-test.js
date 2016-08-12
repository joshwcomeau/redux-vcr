import { expect } from 'chai';
import sinon from 'sinon';

import dataHandler from '../src';
import firebaseStub from './firebase-stub';

dataHandler.newFirebase = firebaseStub;


describe('persist dataHandler', () => {
  it('returns true', () => {
    expect(true).to.equal(true);
  })
});
