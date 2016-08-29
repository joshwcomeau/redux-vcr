/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { actionTypes, actionCreators } from 'redux-vcr.shared';

import { createReplayMiddleware } from '../src';

console.log(actionCreators);

const { PLAY_CASSETTE, STOP_CASSETTE } = actionTypes;
const {
  changeMaximumDelay,
  playCassette,
  stopCassette,
  rewindCassetteAndRestoreApp,
} = actionCreators;


describe('createReplayMiddleware', () => {
  const replayHandler = { play: sinon.stub() };

  const middleware = createReplayMiddleware({
    replayHandler,
  });
  const middlewareWithMaxDelay = createReplayMiddleware({
    replayHandler,
    maximumDelay: 200,
  });

  const next = sinon.stub();

  afterEach(() => {
    next.reset();
    replayHandler.play.reset();
  });

  it('passes unrelated actions through', () => {
    const store = {};
    const action = { type: 'UNRELATED_ACTION' };
    middleware(store)(next)(action);

    expect(next.callCount).to.equal(1);
    expect(next.firstCall.args[0]).to.equal(action);
  });

  it('dispatches `changeMaximumDelay` when a max delay is given', () => {
    const store = {};
    middlewareWithMaxDelay(store)(next);

    console.log(actionCreators.changeMaximumDelay);

    expect(next.callCount).to.equal(1);
    expect(next.firstCall.args[0]).to.deep.equal(
      actionCreators.changeMaximumDelay({ maximumDelay: 200 })
    );
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

      it('does not invoke the replayHandler', () => {
        expect(replayHandler.play.callCount).to.equal(0);
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

      it('invokes the replayHandler', () => {
        expect(replayHandler.play.callCount).to.equal(1);
        expect(replayHandler.play.firstCall.args[0]).to.deep.equal({
          store,
          next,
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

      it('invokes the replayHandler', () => {
        expect(replayHandler.play.callCount).to.equal(1);
        expect(replayHandler.play.firstCall.args[0]).to.deep.equal({
          store,
          next,
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
