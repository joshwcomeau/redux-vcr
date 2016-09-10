import { expect } from 'chai';
import sinon from 'sinon';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { createCaptureMiddleware } from '../src';


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('createCaptureMiddleware', () => {
  const persistHandler = { persist: sinon.stub() };
  const middlewareParams = {
    persistHandler,
  };
  const middleware = createCaptureMiddleware(middlewareParams);
  const store = {};
  const next = sinon.stub();
  const action = { type: 'USERS/ADD_NEW' };
  const blacklistedAction = { type: 'REDUX_VCR/PLAY_CASSETTE' };

  afterEach(() => {
    persistHandler.persist.reset();
    next.reset();
  });

  it('forwards unrelated actions through the middleware', () => {
    const action = { type: 'UNRELATED_BUSINESS' };
    middleware(store)(next)(action);

    expect(next.callCount).to.equal(1);
    expect(next.firstCall.args[0]).to.equal(action);
  });

  context('with invalid arguments', () => {
    it('throws when no persistHandler is provided', () => {
      expect(createCaptureMiddleware).to.throw(/persistHandler/);
    });

    it('throws when the persistHandler "persist" method is not a function', () => {
      const invalidDataHandler = { persist: 'hi there' };

      expect(
        () => createCaptureMiddleware({ persistHandler: invalidDataHandler })
      ).to.throw(/persistHandler/);
    });
  });

  describe('persisting actions', () => {
    it('does not try to persist a REDUX_VCR action', () => {
      middleware(store)(next)(blacklistedAction);

      expect(persistHandler.persist.callCount).to.equal(0);
      expect(next.callCount).to.equal(1);
    });

    it('does persist a valid action', () => {
      middleware(store)(next)(action);

      expect(persistHandler.persist.callCount).to.equal(1);
      expect(next.callCount).to.equal(1);
    });
  });


  describe('cassette metadata', () => {
    it('adds metadata to the cassette', () => {
      const actionWithData = {
        ...action,
        meta: {
          capture: {
            label: 'giorgio_tsoukalos@ancientaliens.com',
          },
        },
      };

      middleware(store)(next)(actionWithData);

      const [cassette] = persistHandler.persist.firstCall.args;

      expect(cassette.data).to.deep.equal(actionWithData.meta.capture);
    });

    it('merges in other data', () => {
      const otherActionWithData = {
        ...action,
        meta: {
          capture: {
            profession: 'Ancient Alien Theorist',
          },
        },
      };
      middleware(store)(next)(otherActionWithData);

      const [cassette] = persistHandler.persist.firstCall.args;

      expect(cassette.data).to.deep.equal({
        label: 'giorgio_tsoukalos@ancientaliens.com',
        profession: 'Ancient Alien Theorist',
      });
    });
  });

  describe('timing', () => {
    // Since we'll be dealing with time, create a new middleware for these tests
    const freshMiddleware = createCaptureMiddleware(middlewareParams);

    it('records the delay between actions', async function(done) {
      freshMiddleware(store)(next)(action);

      await delay(500);
      freshMiddleware(store)(next)(action);

      await delay(500);
      freshMiddleware(store)(next)(action);

      expect(persistHandler.persist.callCount).to.equal(3);

      const [cassette] = persistHandler.persist.firstCall.args;
      const { actions } = cassette;
      const [firstAction, secondAction, thirdAction] = actions;

      // Note that the delay is not the time since the beginning,
      // it's the time since the previous action.
      // For this reason, secondAction and thirdAction should have near-
      // identical delays.

      // Add some wiggle-room, because Travis CI is not always super precise.
      expect(firstAction.delay).to.be.within(0, 200);
      expect(secondAction.delay).to.be.within(490, 600);
      expect(thirdAction.delay).to.be.within(490, 600);

      done();
    });
  });

  describe('startTrigger', () => {
    const startTrigger = 'START_RECORDING';
    const freshMiddleware = createCaptureMiddleware({
      ...middlewareParams,
      startTrigger,
    });

    const reducer = combineReducers({
      food(state = 0, action) {
        switch (action.type) {
          case 'EAT_FOOD': return state - 1;
          case 'RESTOCK_FOOD': return state + 10;
          default: return state;
        }
      },
      recording(state = false, action) {
        switch (action.type) {
          case 'START_RECORDING': return true;
          default: return state;
        }
      }
    });

    const freshStore = createStore(
      reducer,
      applyMiddleware.apply(this, [freshMiddleware])
    );

    context('before the trigger', () => {
      it('forwards, but does not persist, actions', () => {
        freshStore.dispatch({
          type: 'RESTOCK_FOOD'
        });

        expect(freshStore.getState().food).to.equal(10);
        expect(persistHandler.persist.callCount).to.equal(0);
      });
    });

    context('The trigger itself', () => {
      let persistCallCount, cassette;

      before(async function(done) {
        // wait a bit, so that we can test the timestamp
        await delay(200);

        freshStore.dispatch({
          type: startTrigger,
        });

        persistCallCount = persistHandler.persist.callCount;

        done();
      });

      it('does not invoke the persistHandler', () => {
        expect(persistCallCount).to.equal(0);
      });

      it('does update the state', () => {
        const { recording } = freshStore.getState();
        expect(recording).to.equal(true);
      });
    });

    context('The first action after the trigger', () => {
      let persistCallCount, cassette;

      before(async function(done) {
        freshStore.dispatch({
          type: 'EAT_FOOD',
        });

        persistCallCount = persistHandler.persist.callCount;
        cassette = persistHandler.persist.firstCall.args[0];

        done();
      });

      it("updates the cassette's timestamp to be now-ish", () => {
        expect(cassette.timestamp).to.be.closeTo(Date.now(), 20);
      });

      it("passes the current state as the cassette's initialState", () => {
        expect(cassette.initialState).to.deep.equal({
          food: 10,
          recording: true,
        });
      });

      it('does not include previous actions', () => {
        expect(cassette.actions.length).to.equal(1);
      });
    });

    context('re-dispatching the trigger', () => {
      let persistCallCount, cassette;

      before(async function(done) {
        freshStore.dispatch({
          type: startTrigger,
        });

        persistCallCount = persistHandler.persist.callCount;
        cassette = persistHandler.persist.firstCall.args[0];

        done();
      });


      it('invokes persist this time', () => {
        expect(persistHandler.persist.callCount).to.equal(1);
      });

      it('does not wipe previous actions', () => {
        expect(cassette.actions).to.have.length.of(2);
      });

      it('adds this action to the cassette\'s actions', () => {
        const finalAction = cassette.actions[cassette.actions.length - 1];
        expect(finalAction.type).to.equal(startTrigger);
      });
    });
  });

  describe('minimumActionsToPersist', () => {
    context('with 3 min actions, and no start trigger', () => {
      let freshMiddleware, action;

      before(() => {
        freshMiddleware = createCaptureMiddleware({
          ...middlewareParams,
          minimumActionsToPersist: 3,
        });

        action = { type: 'WHATEVER' };
      });

      it('does not persist the first 2 actions', () => {
        freshMiddleware(store)(next)(action);
        freshMiddleware(store)(next)(action);
        expect(next.callCount).to.equal(2);
        expect(persistHandler.persist.callCount).to.equal(0);
      });

      it('does persist the third action', () => {
        freshMiddleware(store)(next)(action);
        expect(next.callCount).to.equal(1);
        expect(persistHandler.persist.callCount).to.equal(1);
      });

      it('includes actions from before the cutoff', () => {
        freshMiddleware(store)(next)(action);
        const { actions } = persistHandler.persist.args[0][0];
        expect(actions).to.have.length.of(4);
      });
    });

    context('with a start trigger', () => {
      let freshMiddleware, store;
      const startTrigger = 'TRIGGER';

      before(() => {
        freshMiddleware = createCaptureMiddleware({
          ...middlewareParams,
          minimumActionsToPersist: 2,
          startTrigger,
        });

        store = createStore(function() {});
      });

      it('ignores actions before the trigger', () => {
        const action = { type: 'WHATEVER' };

        freshMiddleware(store)(next)(action);
        freshMiddleware(store)(next)(action);
        freshMiddleware(store)(next)(action);
        freshMiddleware(store)(next)(action);
        expect(next.callCount).to.equal(4);
        expect(persistHandler.persist.callCount).to.equal(0);
      });

      it('does not persist the trigger', () => {
        freshMiddleware(store)(next)({ type: startTrigger });
        expect(next.callCount).to.equal(1);
        expect(persistHandler.persist.callCount).to.equal(0);
      });

      it('does not persist the first action after the trigger (below limit)', () => {
        const action = { type: 'POST_TRIGGER' };
        freshMiddleware(store)(next)(action);

        expect(persistHandler.persist.callCount).to.equal(0);
      });

      it('persists both new actions once min limit is hit', () => {
        const action = { type: 'SECOND_POST_TRIGGER' };

        freshMiddleware(store)(next)(action);

        expect(persistHandler.persist.callCount).to.equal(1);

        const { actions } = persistHandler.persist.args[0][0];
        expect(actions).to.have.length.of(2);
        expect(actions[0].type).to.equal('POST_TRIGGER');
        expect(actions[1].type).to.equal('SECOND_POST_TRIGGER');
      });
    });
  });
});
