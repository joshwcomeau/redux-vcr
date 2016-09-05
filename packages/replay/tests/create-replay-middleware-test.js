/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { actionTypes, actionCreators } from 'redux-vcr.shared';

import { createReplayMiddleware } from '../src';


const {
  PLAY_CASSETTE,
  STOP_CASSETTE,
  REWIND_CASSETTE_AND_RESTORE_APP,
  UPDATE_CASSETTE_INITIAL_STATE,
} = actionTypes;
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

    expect(next.callCount).to.equal(1);
    expect(next.firstCall.args[0]).to.deep.equal(
      changeMaximumDelay({ maximumDelay: 200 })
    );
  });

  describe(PLAY_CASSETTE, () => {
    const buildDefaultState = status => ({
      reduxVCR: {
        play: {
          status,
        },
        cassettes: {
          byId: { abc123: {} },
          selected: 'abc123',
        },
      },
    });

    context('while playing', () => {
      const store = {
        getState() {
          return buildDefaultState('playing');
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
          return buildDefaultState('paused');
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
          return buildDefaultState('stopped');
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

    context('when no cassette is selected', () => {
      const store = {
        getState() {
          return {
            reduxVCR: {
              play: { status: 'stopped' },
              cassettes: {
                byId: { abc123: {} },
              },
            },
          };
        },
      };

      const action = playCassette();

      it('throws an invariant violation', () => {
        expect(
          () => middleware(store)(next)(action)
        ).to.throw();
      });
    });

    context('when an invalid cassette is selected', () => {
      const store = {
        getState() {
          return {
            reduxVCR: {
              play: { status: 'stopped' },
              cassettes: {
                byId: { abc123: {} },
                selected: 'def456',
              },
            },
          };
        },
      };

      const action = playCassette();

      it('throws an invariant violation', () => {
        expect(
          () => middleware(store)(next)(action)
        ).to.throw();
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

  describe('overwriteCassetteState', () => {
    const initialState = {
      user: {
        authenticated: true,
        email: 'james@dean.com',
      },
    };

    const store = {
      getState() {
        return {
          reduxVCR: {
            play: { status: 'stopped' },
            cassettes: {
              byId: {
                abc123: {
                  initialState,
                },
              },
              selected: 'abc123',
            },
          },
        };
      },
    };

    const action = playCassette();

    context('with object', () => {
      const middlewareWithOverrideObj = createReplayMiddleware({
        replayHandler,
        overwriteCassetteState: {
          user: {
            authenticated: false,
          },
        },
      });

      beforeEach(() => {
        middlewareWithOverrideObj(store)(next)(action);
      });

      it('dispatches 3 actions', () => {
        expect(next.callCount).to.equal(3);

        const [first, second, third] = [
          next.firstCall.args[0],
          next.secondCall.args[0],
          next.thirdCall.args[0],
        ];

        expect(first.type).to.equal(REWIND_CASSETTE_AND_RESTORE_APP);
        expect(second.type).to.equal(UPDATE_CASSETTE_INITIAL_STATE);
        expect(third.type).to.equal(PLAY_CASSETTE);
      });

      it('creates a deeply-merged state', () => {
        const updateCassetteAction = next.secondCall.args[0];

        expect(updateCassetteAction.newState).to.deep.equal({
          user: {
            authenticated: false,
            email: 'james@dean.com',
          },
        });
      });
    });

    context('with function', () => {
      const overwriteCassetteState = sinon.stub();
      const middlewareWithOverrideFn = createReplayMiddleware({
        replayHandler,
        overwriteCassetteState,
      });

      beforeEach(() => {
        overwriteCassetteState.returns({ hi: 5 });
        middlewareWithOverrideFn(store)(next)(action);
      });

      afterEach(() => {
        overwriteCassetteState.reset();
      });

      it('dispatches 3 actions', () => {
        expect(next.callCount).to.equal(3);

        const [first, second, third] = [
          next.firstCall.args[0],
          next.secondCall.args[0],
          next.thirdCall.args[0],
        ];

        expect(first.type).to.equal(REWIND_CASSETTE_AND_RESTORE_APP);
        expect(second.type).to.equal(UPDATE_CASSETTE_INITIAL_STATE);
        expect(third.type).to.equal(PLAY_CASSETTE);
      });

      it('invokes the override function', () => {
        expect(overwriteCassetteState.callCount).to.equal(1);
      });

      it('returns the object returned by the overwrite fn', () => {
        const updateCassetteAction = next.secondCall.args[0];

        expect(updateCassetteAction.newState).to.deep.equal({
          hi: 5,
        });
      });
    });
  });
});
