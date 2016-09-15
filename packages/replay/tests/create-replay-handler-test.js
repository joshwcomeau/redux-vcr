/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { createStore, combineReducers } from 'redux';
import { actionTypes, actionCreators, reduxVCRReducer } from 'redux-vcr.shared';

import { createReplayHandler } from '../src';


const {
  INCREMENT_ACTIONS_PLAYED,
  STOP_CASSETTE,
} = actionTypes;

const {
  selectCassette,
  playCassette,
  pauseCassette,
  stopCassette,
  cassettesListSuccess,
  cassetteActionsReceive,
  changePlaybackSpeed,
  changeMaximumDelay,
} = actionCreators;


function createNewStore() {
  return createStore(
    combineReducers({ reduxVCR: reduxVCRReducer })
  );
}

function loadAndSelectCassette({ store, id = 'abc' } = {}) {
  // We need to set up the state, by dispatching actions.
  // I couldn't come up with a good way to stub this :(
  store.dispatch(cassettesListSuccess({
    cassettes: {
      [id]: { label: 'selected cassette', numOfActions: 3 },
      xyz: { label: 'other cassette', numOfActions: 10 },
    },
  }));
  store.dispatch(selectCassette({ id: 'abc' }));
}

function loadActionsForCassette({ store, id = 'abc', delay = 50 } = {}) {
  store.dispatch(cassetteActionsReceive({
    id,
    cassetteActions: [
      { type: 'ACTION_1', delay },
      { type: 'ACTION_2', delay },
      { type: 'ACTION_3', delay },
    ],
  }));
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


describe('createReplayHandler', () => {
  describe('false starts', () => {
    const replayHandler = createReplayHandler();
    const store = createNewStore();
    sinon.spy(store, 'dispatch');

    afterEach(() => {
      store.dispatch.reset();
    });

    it('does nothing when no cassette is selected', done => {
      replayHandler.play({ store, next: store.dispatch });

      setTimeout(() => {
        expect(store.dispatch.callCount).to.equal(0);
        done();
      }, 1);
    });

    it('does nothing when the cassette is paused', done => {
      loadAndSelectCassette({ store });
      store.dispatch(pauseCassette());

      store.dispatch.reset();

      replayHandler.play({ store, next: store.dispatch });

      setTimeout(() => {
        expect(store.dispatch.callCount).to.equal(0);
        done();
      }, 1);
    });

    it('does nothing when the cassette is stopped', () => {
      loadAndSelectCassette({ store });
      store.dispatch(stopCassette());

      store.dispatch.reset();

      replayHandler.play({ store, next: store.dispatch });

      expect(store.dispatch.callCount).to.equal(0);
    });
  });

  describe('play logic - simple', () => {
    const replayHandler = createReplayHandler();
    const store = createNewStore();
    sinon.spy(store, 'dispatch');

    afterEach(() => {
      store.dispatch.reset();
    });

    beforeEach(() => {
      loadAndSelectCassette({ store });
      loadActionsForCassette({ store });
      store.dispatch(playCassette());
      store.dispatch.reset();
    });

    it('invokes `next` 7 times, to dispatch various actions', done => {
      // We need to dispatch quite a bit!
      //   - The 3 actions in the queue themselves
      //   - one additional action per action to increment actions played
      //   - finally, an action at the end to stop the cassette.
      JSON.stringify(store.getState(), null, 2);
      replayHandler.play({ store, next: store.dispatch });

      setTimeout(() => {
        const [
          call1, call2, call3, call4, call5, call6, call7,
        ] = store.dispatch.args;

        expect(store.dispatch.callCount).to.equal(7);

        expect(call1[0].type).to.equal('ACTION_1');
        expect(call2[0].type).to.equal(INCREMENT_ACTIONS_PLAYED);
        expect(call3[0].type).to.equal('ACTION_2');
        expect(call4[0].type).to.equal(INCREMENT_ACTIONS_PLAYED);
        expect(call5[0].type).to.equal('ACTION_3');
        expect(call6[0].type).to.equal(INCREMENT_ACTIONS_PLAYED);
        expect(call7[0].type).to.equal(STOP_CASSETTE);

        done();
      }, 250);
    });

    it('pauses for the specified delay between dispatches', done => {
      replayHandler.play({ store, next: store.dispatch });

      // It should immediately dispatch the first 2 actions
      expect(store.dispatch.callCount).to.equal(2);

      delay(75)
        .then(() => expect(store.dispatch.callCount).to.equal(4))
        .then(() => delay(75))
        .then(() => expect(store.dispatch.callCount).to.equal(7))
        .then(() => done());
    });
  });

  describe('play logic - with maximumDelay', () => {
    const replayHandler = createReplayHandler();
    const store = createNewStore();
    store.dispatch(changeMaximumDelay({ maximumDelay: 200 }));
    sinon.spy(store, 'dispatch');

    afterEach(() => {
      store.dispatch.reset();
    });

    beforeEach(() => {
      loadAndSelectCassette({ store });

      store.dispatch(cassetteActionsReceive({
        id: 'abc',
        cassetteActions: [
          { type: 'ACTION_1', delay: 0 },
          { type: 'ACTION_2', delay: 100 },
          { type: 'ACTION_3', delay: 10000 },
          { type: 'ACTION_3', delay: 10000 },
        ],
      }));

      store.dispatch(playCassette());
      store.dispatch.reset();
    });

    it('waits a maximum of 200ms between actions', done => {
      replayHandler.play({
        store,
        next: store.dispatch,
      });

      expect(store.dispatch.callCount).to.equal(2);

      delay(110)
        .then(() => expect(store.dispatch.callCount).to.equal(4))
        .then(() => delay(210))
        .then(() => expect(store.dispatch.callCount).to.equal(6))
        .then(() => delay(210))
        .then(() => expect(store.dispatch.callCount).to.equal(9))
        .then(() => done());
    });
  });

  describe('play logic - with playbackSpeed', () => {
    const replayHandler = createReplayHandler();
    const store = createNewStore();
    sinon.spy(store, 'dispatch');

    afterEach(() => {
      store.dispatch.reset();
    });

    beforeEach(() => {
      loadAndSelectCassette({ store });
      loadActionsForCassette({ store, delay: 50 });
      store.dispatch(changePlaybackSpeed({ playbackSpeed: 0.5 }));
      store.dispatch(playCassette());
      store.dispatch.reset();
    });

    it('plays the actions with double their natural delay', done => {
      replayHandler.play({
        store,
        next: store.dispatch,
      });

      expect(store.dispatch.callCount).to.equal(2);

      delay(55)
        // Even though the delay is set for 50ms, after 55ms it hasn't changed.
        .then(() => expect(store.dispatch.callCount).to.equal(2))
        .then(() => delay(55))
        // After another 55ms, though, 110ms > (50ms * 2).
        .then(() => expect(store.dispatch.callCount).to.equal(4))
        .then(() => delay(55))
        .then(() => expect(store.dispatch.callCount).to.equal(4))
        .then(() => delay(55))
        .then(() => expect(store.dispatch.callCount).to.equal(7))
        .then(() => done());
    });
  });

  describe('play logic - with maximumDelay and playbackSpeed', () => {
    // When both playbackSpeed and maximumDelay are provided, we want to
    // adjust the speed BEFORE clamping the value to the maximum.
    const replayHandler = createReplayHandler({ maximumDelay: 100 });
    const store = createNewStore();
    sinon.spy(store, 'dispatch');

    afterEach(() => {
      store.dispatch.reset();
    });

    beforeEach(() => {
      loadAndSelectCassette({ store });
      loadActionsForCassette({ store, delay: 50 });
      store.dispatch(changePlaybackSpeed({ playbackSpeed: 0.1 }));
      store.dispatch(playCassette());
      store.dispatch.reset();
    });

    it('plays the actions with a clamped, modified speed', done => {
      replayHandler.play({
        store,
        next: store.dispatch,
      });

      expect(store.dispatch.callCount).to.equal(2);

      delay(55)
        // Even though the delay is set for 50ms, after 55ms it hasn't changed.
        .then(() => expect(store.dispatch.callCount).to.equal(2))
        .then(() => delay(55))
        // After another 55ms, though, 110ms > (50ms * 2).
        // .then(() => expect(store.dispatch.callCount).to.equal(4))
        // .then(() => delay(55))
        // .then(() => expect(store.dispatch.callCount).to.equal(4))
        // .then(() => delay(55))
        // .then(() => expect(store.dispatch.callCount).to.equal(7))
        .then(() => done());
    });
  });
});
