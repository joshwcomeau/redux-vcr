/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';

import { replayMiddleware } from '../src';
import playHandler from './stubs/play-handler-stub.js';


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('replayMiddleware', () => {
  const middleware = replayMiddleware();
  const store = {};
  const next = sinon.stub();

  afterEach(() => {
    next.reset();
  });

  it('intercepts PLAY_CASSETTE', () => {
    const store = {
      getState() {}
    }
    const action = { type: 'PLAY_CASSETTE' };
    middleware(store)(next)(action);

    expect(next.callCount).to.equal(1);
    expect(next.firstCall.args[0]).to.equal(action);
  });
});
