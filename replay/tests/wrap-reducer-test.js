/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { combineReducers } from 'redux';
import sinon from 'sinon';

import { wrapReducer } from '../src';
import {
  changePlaybackSpeed,
  rewindCassetteAndRestoreApp,
  CHANGE_PLAYBACK_SPEED,
  REWIND_CASSETTE_AND_RESTORE_APP,
} from '../../shared/src/actions';


const applesReducer = (state = 5, action) => {
  switch (action.type) {
    case 'INCREMENT_APPLES': return state + 1;
    case 'DECREMENT_APPLES': return state - 1;
    default: return state;
  }
};

const orangesReducer = (state = 5, action) => {
  switch (action.type) {
    case 'INCREMENT_ORANGES': return state + 1;
    case 'DECREMENT_ORANGES': return state - 1;
    default: return state;
  }
};

const originalReducer = combineReducers({
  apples: applesReducer,
  oranges: orangesReducer,
});

const wrappedReducer = wrapReducer(originalReducer);


describe('wrapReducer', () => {
  describe('initialization', () => {
    it('instantiates default user state + reduxVCR state', () => {
      const state = wrappedReducer({}, {});

      expect(state).to.include.keys('apples', 'oranges', 'reduxVCR');
      expect(state.apples).to.equal(5);
      expect(state.oranges).to.equal(5);
      expect(state.reduxVCR).to.include.keys('actions', 'cassettes', 'play', 'user');
    });
  });

  describe('unrelated actions', () => {
    it('updates the original reducers', () => {
      const state = wrappedReducer({}, {});
      const action = { type: 'INCREMENT_ORANGES' };

      const newState = wrappedReducer(state, action);

      expect(newState).to.include.keys('apples', 'oranges');
      expect(newState.apples).to.equal(5);
      expect(newState.oranges).to.equal(6);
    });

    it('appends reduxVCR stuff to the returned state', () => {
      const state = wrappedReducer({}, {});
      const action = { type: 'INCREMENT_ORANGES' };

      const newState = wrappedReducer(state, action);

      const newStateKeys = Object.keys(newState);
      const reduxVCRKeys = Object.keys(newState.reduxVCR);

      expect(newStateKeys).to.deep.equal([
        'apples', 'oranges', 'reduxVCR',
      ]);

      expect(reduxVCRKeys).to.deep.equal([
        'actions', 'cassettes', 'play', 'user',
      ]);
    });
  });

  // This action exclusively affects ReduxVCR. We expect it to leave the
  // user's state intact.
  describe(CHANGE_PLAYBACK_SPEED, () => {
    it("does not affect the user's state, but does affect reduxVCR", () => {
      const state = wrappedReducer({}, {});

      state.apples = 12;
      state.oranges = 34;

      const action = changePlaybackSpeed({ playbackSpeed: 0.5 });
      const newState = wrappedReducer(state, action);

      expect(newState.apples).to.equal(12);
      expect(newState.oranges).to.equal(34);
      expect(newState.reduxVCR.play.speed).to.equal(0.5);
    });
  });

  describe(REWIND_CASSETTE_AND_RESTORE_APP, () => {
    it('resets all but the reduxVCR slice when requested', () => {
      const state = wrappedReducer({}, {});

      // These changes should be wiped out when we rewind and restore.
      state.apples = 12;
      state.oranges = 15;

      // However, changes to reduxVCR should persist
      state.reduxVCR.play.speed = 2;

      const action = rewindCassetteAndRestoreApp();

      const newState = wrappedReducer(state, action);

      expect(newState.oranges).to.equal(5);
      expect(newState.apples).to.equal(5);
      expect(newState.reduxVCR.play.speed).to.equal(2);
    });
  });
});
