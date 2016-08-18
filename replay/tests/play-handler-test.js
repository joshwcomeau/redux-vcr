/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { createStore, applyMiddleware, combineReducers } from 'redux';

import { playHandler, replayMiddleware } from '../src';
import reducer from '../../shared/src/reducers';
import {
  selectCassette,
  playCassette,
  pauseCassette,
  stopCassette,
  cassettesListReceive,
  cassetteActionsReceive,
} from '../../shared/src/actions';

// TODO: Because next() actually does stuff, we need to import and build
// a proper store. And then pass its dispatcher to the playHandler.

function createNewStore() {
  return createStore(
    combineReducers({ reduxVCR: reducer }),
    applyMiddleware.apply(this, [replayMiddleware()])
  );
}

function loadAndSelectCassette(store, id = 'abc123') {
  // We need to set up the state, by dispatching actions.
  // I couldn't come up with a good way to stub this :(
  store.dispatch(cassettesListReceive({
    cassettes: {
      [id]: { label: 'selected cassette', numOfActions: 3 },
      xyz: { label: 'other cassette', numOfActions: 10 },
    },
  }));
  store.dispatch(selectCassette({ id: 'abc' }));
}

function loadActionsForCassette(store, id = 'abc123') {
  store.dispatch(cassetteActionsReceive({
    id,
    cassetteActions: [
      { type: 'ACTION_1', delay: 50 },
      { type: 'ACTION_2', delay: 50 },
      { type: 'ACTION_3', delay: 50 },
    ],
  }));
}

describe('playHandler', () => {
  describe('false starts', () => {
    const store = createNewStore();
    sinon.spy(store, 'dispatch');

    afterEach(() => {
      store.dispatch.reset();
    });

    it('does nothing when no cassette is selected', () => {
      playHandler({ store, next: store.dispatch });

      expect(store.dispatch.callCount).to.equal(0);
    });

    it('does nothing when the cassette is paused', () => {
      loadAndSelectCassette(store);
      store.dispatch(pauseCassette());

      store.dispatch.reset();

      playHandler({ store, next: store.dispatch });

      expect(store.dispatch.callCount).to.equal(0);
    });

    it('does nothing when the cassette is stopped', () => {
      loadAndSelectCassette(store);
      store.dispatch(stopCassette());

      store.dispatch.reset();

      playHandler({ store, next: store.dispatch });

      expect(store.dispatch.callCount).to.equal(0);
    });
  });

  describe('play logic', () => {
    const store = createNewStore();
    sinon.spy(store, 'dispatch');

    afterEach(() => {
      store.dispatch.reset();
    });

    before(() => {
      loadAndSelectCassette(store);
      loadActionsForCassette(store);
    });

    it('invokes `next` 7 times, to dispatch various actions', done => {
      // We need to dispatch quite a bit!
      //   - The 3 actions in the queue themselves
      //   - one additional action per action to increment actions played
      //   - finally, an action at the end to stop the cassette.
      playHandler({ store, next: store.dispatch });

      window.setTimeout(() => {
        console.log("ARGS")
        store.dispatch.args.forEach(arg => console.log(arg))
        expect(store.dispatch.callCount).to.equal(7);

        done();
      }, 250);
    });
  });
});
