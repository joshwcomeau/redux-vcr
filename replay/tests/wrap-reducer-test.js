/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';

import { wrapMiddleware } from '../src';


describe('wrapReducer', () => {
  const originalReducer = sinon.stub();
  const wrappedReducer = wrapReducer(originalReducer);

  afterEach(() => {
    originalReducer.reset();
  });

  it('passes unrelated actions through to the default reducer', () => {
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

      it('passes the action through without rewinding', () => {
        expect(next.callCount).to.equal(1);
        expect(next.firstCall.args[0]).to.equal(action);
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

      it('does not invoke the playHandler', () => {
        expect(playHandler.callCount).to.equal(0);
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
          next,
        });
      });
    });
  });
});
