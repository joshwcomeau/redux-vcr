/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { createStore } from 'redux';
import { actionTypes, actionCreators } from 'redux-vcr.shared';

import { createReplayMiddleware } from '../src';


const {
  PLAY_CASSETTE,
  PAUSE_CASSETTE,
  STOP_CASSETTE,
  EJECT_CASSETTE,
  REWIND_CASSETTE_AND_RESTORE_APP,
  UPDATE_CASSETTE_INITIAL_STATE,
} = actionTypes;
const {
  changeMaximumDelay,
  playCassette,
  pauseCassette,
  stopCassette,
  ejectCassette,
  rewindCassetteAndRestoreApp,
} = actionCreators;


describe('createReplayMiddleware', () => {
  const replayHandler = { play: sinon.stub() };

  const onPlay = sinon.stub();
  const onPause = sinon.stub();
  const onStop = sinon.stub();
  const onEject = sinon.stub();

  const middleware = createReplayMiddleware({
    replayHandler,
    onPlay,
    onPause,
    onStop,
    onEject,
  });

  const middlewareWithMaxDelay = createReplayMiddleware({
    replayHandler,
    maximumDelay: 200,
    onPlay,
    onPause,
    onStop,
    onEject,
  });

  const next = sinon.stub();

  const pointlessReducer = state => state;

  const buildDefaultState = (status, selected = 'abc123') => ({
    reduxVCR: {
      play: {
        status,
      },
      cassettes: {
        byId: { abc123: {} },
        status: 'loaded',
        selected,
      },
    },
  });

  afterEach(() => {
    next.reset();
    onPlay.reset();
    onPause.reset();
    onStop.reset();
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
    context('while playing', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('playing')
      );
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

      it('does not invoke the onPlay hook', () => {
        expect(onPlay.callCount).to.equal(0);
      });
    });

    context('while paused', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('paused')
      );
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

      it('invokes the onPlay hook', () => {
        expect(onPlay.callCount).to.equal(1);
        expect(onPlay.firstCall.args[0]).to.equal(store.dispatch);
        expect(onPlay.firstCall.args[1]).to.equal(store.getState);
      });
    });

    context('while stopped', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('stopped')
      );
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

      it('invokes the onPlay hook', () => {
        expect(onPlay.callCount).to.equal(1);
        expect(onPlay.firstCall.args[0]).to.equal(store.dispatch);
        expect(onPlay.firstCall.args[1]).to.equal(store.getState);
      });
    });

    context('when no cassette is selected', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('stopped', null)
      );

      const action = playCassette();

      it('throws an invariant violation', () => {
        expect(
          () => middleware(store)(next)(action)
        ).to.throw();
      });

      it('does not invoke the onPlay hook', () => {
        expect(onPlay.callCount).to.equal(0);
      });
    });

    context('when an invalid cassette is selected', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('stopped', 'def456')
      );

      const action = playCassette();

      it('throws an invariant violation', () => {
        expect(
          () => middleware(store)(next)(action)
        ).to.throw();
      });
    });
  });


  describe(PAUSE_CASSETTE, () => {
    const action = pauseCassette();

    context('while playing', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('playing')
      );

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('invokes the onPause hook', () => {
        expect(onPause.callCount).to.equal(1);
        expect(onPause.firstCall.args[0]).to.equal(store.dispatch);
        expect(onPause.firstCall.args[1]).to.equal(store.getState);
      });
    });

    context('while paused', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('paused')
      );

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('does not invoke the onPause hook', () => {
        expect(onPause.callCount).to.equal(0);
      });
    });

    context('while stopped', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('stopped')
      );

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('invokes the onPause hook', () => {
        expect(onPause.callCount).to.equal(1);
        expect(onPause.firstCall.args[0]).to.equal(store.dispatch);
        expect(onPause.firstCall.args[1]).to.equal(store.getState);
      });
    });
  });

  describe(STOP_CASSETTE, () => {
    context('while playing', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('playing')
      );
      const action = stopCassette();

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('rewinds and passes the action through', () => {
        expect(next.callCount).to.equal(2);

        expect(next.firstCall.args[0]).to.equal(action);

        expect(next.secondCall.args[0]).to.deep.equal(
          rewindCassetteAndRestoreApp()
        );
      });

      it('invokes the onStop hook', () => {
        expect(onStop.callCount).to.equal(1);
        expect(onStop.firstCall.args[0]).to.equal(store.dispatch);
        expect(onStop.firstCall.args[1]).to.equal(store.getState);
      });
    });

    context('while paused', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('paused')
      );
      const action = stopCassette();

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('rewinds and passes the action through', () => {
        expect(next.callCount).to.equal(2);

        expect(next.firstCall.args[0]).to.equal(action);

        expect(next.secondCall.args[0]).to.deep.equal(
          rewindCassetteAndRestoreApp()
        );
      });

      it('invokes the onStop hook', () => {
        expect(onStop.callCount).to.equal(1);
        expect(onStop.firstCall.args[0]).to.equal(store.dispatch);
        expect(onStop.firstCall.args[1]).to.equal(store.getState);
      });
    });


    context('while stopped', () => {
      const store = createStore(
        pointlessReducer,
        buildDefaultState('stopped')
      );
      const action = stopCassette();

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('passes the action through without rewinding', () => {
        expect(next.callCount).to.equal(1);
        expect(next.firstCall.args[0]).to.equal(action);
      });

      it('does not invoke the onStop hook', () => {
        expect(onStop.callCount).to.equal(0);
      });
    });
  });

  describe(EJECT_CASSETTE, () => {
    const action = ejectCassette();
    const store = createStore(
      pointlessReducer,
      buildDefaultState('playing')
    );

    beforeEach(() => {
      middleware(store)(next)(action);
    });

    it('invokes the onEject hook', () => {
      expect(onEject.callCount).to.equal(1);
      expect(onEject.firstCall.args[0]).to.equal(store.dispatch);
      expect(onEject.firstCall.args[1]).to.equal(store.getState);
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
      dispatch() {},
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

        expect(first.type).to.equal(UPDATE_CASSETTE_INITIAL_STATE);
        expect(second.type).to.equal(REWIND_CASSETTE_AND_RESTORE_APP);
        expect(third.type).to.equal(PLAY_CASSETTE);
      });

      it('creates a deeply-merged state', () => {
        const updateCassetteAction = next.firstCall.args[0];

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

        expect(first.type).to.equal(UPDATE_CASSETTE_INITIAL_STATE);
        expect(second.type).to.equal(REWIND_CASSETTE_AND_RESTORE_APP);
        expect(third.type).to.equal(PLAY_CASSETTE);
      });

      it('invokes the override function', () => {
        expect(overwriteCassetteState.callCount).to.equal(1);
      });

      it('returns the object returned by the overwrite fn', () => {
        const updateCassetteAction = next.firstCall.args[0];

        expect(updateCassetteAction.newState).to.deep.equal({
          hi: 5,
        });
      });
    });
  });
});
