import { expect } from 'chai';
import sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux';

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
      expect(firstAction.delay).to.be.within(0, 150);
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

    const initialState = { hasFood: true };
    const reducer = function(state = initialState, action) {
      switch (action.type) {
        case 'EAT_FOOD': return { hasFood: false };
        case 'RESTOCK_FOOD': return { hasFood: true };
        default: return state;
      }
    };

    const freshStore = createStore(
      reducer,
      applyMiddleware.apply(this, [freshMiddleware])
    );

    context('before the trigger', () => {
      it('forwards, but does not persist, actions', () => {
        freshStore.dispatch({
          type: 'EAT_FOOD'
        });

        expect(freshStore.getState().hasFood).to.equal(false);
        expect(persistHandler.persist.callCount).to.equal(0);
      });
    });

    context('The trigger itself', () => {
      let callCount, cassette;

      before(async function(done) {
        // wait a bit, so that we can test the timestamp
        await delay(200);

        freshStore.dispatch({
          type: startTrigger,
        });

        callCount = persistHandler.persist.callCount;
        cassette = persistHandler.persist.firstCall.args[0];

        done();
      });

      it('only invokes the persistHandler once', () => {
        expect(callCount).to.equal(1);
      });

      it("updates the cassette's timestamp to be now-ish", () => {
        expect(cassette.timestamp).to.be.closeTo(Date.now(), 10);
      });

      it("passes the current state as the cassette's initialState", () => {
        expect(cassette.initialState).to.deep.equal({
          hasFood: false,
        });
      });

      it('only persists a single actions', () => {
        expect(cassette.actions.length).to.equal(1);
      });

      it('persists the trigger action, with no delay', () => {
        const action = cassette.actions[0];
        expect(action.type).to.equal(startTrigger);
        expect(action.delay).to.be.closeTo(0, 10);
      });
    });

    context('after the trigger', () => {
      before(async function(done) {
        await delay(200);
        done();
      });

      it('persists actions as normal', () => {
        freshStore.dispatch({
          type: 'RESTOCK_FOOD',
        });

        expect(persistHandler.persist.callCount).to.equal(1);
        const cassette = persistHandler.persist.firstCall.args[0];

        expect(cassette.actions).to.have.length.of(2);

        const action = cassette.actions[1];
        expect(action.type).to.equal('RESTOCK_FOOD')
        expect(action.delay).to.be.closeTo(200, 50);
      });

      it('does not wipe previous actions if the trigger is re-dispatched', () => {
        freshStore.dispatch({
          type: startTrigger,
        });

        expect(persistHandler.persist.callCount).to.equal(1);

        const cassette = persistHandler.persist.firstCall.args[0];
        expect(cassette.actions).to.have.length.of(3);
      });
    });


    it('persists the current state as initialState on trigger');

    // also check 'delay'!
    it('resets the start time to match the trigger action');

    it('has no effect on further triggers')
  });
});
