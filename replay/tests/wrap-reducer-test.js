/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';

import { wrapReducer } from '../src';
import { rewindCassetteAndRestoreApp } from '../../shared/src/actions';


describe('wrapReducer', () => {
  const originalReducer = sinon.stub();
  const wrappedReducer = wrapReducer(originalReducer);

  afterEach(() => {
    originalReducer.reset();
  });

  it('passes unrelated actions through to the default reducer', () => {
    const state = {};
    const action = { type: 'UNRELATED_ACTION' };
    wrappedReducer(state, action);

    expect(originalReducer.callCount).to.equal(1);
    expect(originalReducer.firstCall.args[0]).to.equal(state);
    expect(originalReducer.firstCall.args[1]).to.equal(action);
  });

  it('resets all but the reduxVCR slice when requested', () => {
    const state = {
      reduxVCR: {
        cassettes: [1, 2, 3],
      },
      calendarMonths: ['January', 'February', 'etc'],
    };

    const action = rewindCassetteAndRestoreApp();

    wrappedReducer(state, action);

    expect(originalReducer.callCount).to.equal(1);
    expect(originalReducer.firstCall.args[0]).to.deep.equal({
      reduxVCR: {
        cassettes: [1, 2, 3],
      },
    });
    expect(originalReducer.firstCall.args[1]).to.deep.equal({});
  });
});
