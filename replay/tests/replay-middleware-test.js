/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';

import { replayMiddleware } from '../src';
import { actionTypes, actionCreators } from '../../shared/src';
import playHandler from './stubs/play-handler-stub.js';

const { PLAY_CASSETTE, STOP_CASSETTE } = actionTypes;
const {
  playCassette,
  stopCassette,
  rewindCassetteAndRestoreApp,
} = actionCreators;


describe('replayMiddleware', () => {
  const middleware = replayMiddleware({
    playHandler,
    maximumDelay: 100,
  });
  const next = sinon.stub();

  afterEach(() => {
    next.reset();
    playHandler.reset();
  });

  it('passes unrelated actions through', () => {
    const store = {};
    const action = { type: 'UNRELATED_ACTION' };
    middleware(store)(next)(action);

    expect(next.callCount).to.equal(1);
    expect(next.firstCall.args[0]).to.equal(action);
  });

  describe(PLAY_CASSETTE, () => {
    context('while playing', () => {
      const store = {
        getState() {
          return {
            reduxVCR: { play: { status: 'playing' } },
          };
        },
      };
      const action = playCassette();

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('does not pass the action through (no point)', () => {
        expect(next.callCount).to.equal(0);
      });

      it('does not invoke the playHandler', () => {
        expect(playHandler.callCount).to.equal(0);
      });
    });

    context('while paused', () => {
      const store = {
        getState() {
          return {
            reduxVCR: { play: { status: 'paused' } },
          };
        },
      };
      const action = playCassette();

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('passes the action through without rewinding', () => {
        expect(next.callCount).to.equal(1);
        expect(next.firstCall.args[0]).to.equal(action);
      });

      it('invokes the playHandler', () => {
        expect(playHandler.callCount).to.equal(1);
        expect(playHandler.firstCall.args[0]).to.deep.equal({
          store,
          maximumDelay: 100,
        });
      });
    });

    context('while stopped', () => {
      const store = {
        getState() {
          return {
            reduxVCR: { play: { status: 'stopped' } },
          };
        },
      };
      const action = playCassette();

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('rewinds and passes the action through', () => {
        expect(next.callCount).to.equal(2);

        expect(next.firstCall.args[0]).to.deep.equal(
          rewindCassetteAndRestoreApp()
        );
        expect(next.secondCall.args[0]).to.equal(action);
      });

      it('invokes the playHandler', () => {
        expect(playHandler.callCount).to.equal(1);
        expect(playHandler.firstCall.args[0]).to.deep.equal({
          store,
          maximumDelay: 100,
        });
      });
    });
  });


  describe(STOP_CASSETTE, () => {
    context('while playing', () => {
      const store = {
        getState() {
          return {
            reduxVCR: { play: { status: 'playing' } },
          };
        },
      };
      const action = stopCassette();

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('rewinds and passes the action through', () => {
        expect(next.callCount).to.equal(2);

        expect(next.firstCall.args[0]).to.deep.equal(
          rewindCassetteAndRestoreApp()
        );
        expect(next.secondCall.args[0]).to.equal(action);
      });
    });

    context('while paused', () => {
      const store = {
        getState() {
          return {
            reduxVCR: { play: { status: 'paused' } },
          };
        },
      };
      const action = stopCassette();

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('rewinds and passes the action through', () => {
        expect(next.callCount).to.equal(2);

        expect(next.firstCall.args[0]).to.deep.equal(
          rewindCassetteAndRestoreApp()
        );
        expect(next.secondCall.args[0]).to.equal(action);
      });
    });


    context('while stopped', () => {
      const store = {
        getState() {
          return {
            reduxVCR: { play: { status: 'stopped' } },
          };
        },
      };
      const action = stopCassette();

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('passes the action through without rewinding', () => {
        expect(next.callCount).to.equal(1);
        expect(next.firstCall.args[0]).to.equal(action);
      });
    });
  });
});
