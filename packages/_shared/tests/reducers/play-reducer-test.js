import { expect } from 'chai';

import reducer from '../../src/reducers/play.reducer';
import {
  CHANGE_PLAYBACK_SPEED,
  EJECT_CASSETTE,
  PAUSE_CASSETTE,
  PLAY_CASSETTE,
  STOP_CASSETTE,
  changePlaybackSpeed,
  ejectCassette,
  pauseCassette,
  playCassette,
  stopCassette,
} from '../../src/actions';


describe('play reducer', () => {
  describe(CHANGE_PLAYBACK_SPEED, () => {
    it('updates speed', () => {
      const state = reducer({}, {});
      const action = changePlaybackSpeed({ playbackSpeed: 2 });

      const expectedState = {
        ...state,
        speed: 2,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(EJECT_CASSETTE, () => {
    it('updates status to stopped', () => {
      const state = reducer({ status: 'playing' }, {});
      const action = ejectCassette();

      const expectedState = {
        ...state,
        status: 'stopped',
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(PLAY_CASSETTE, () => {
    it('updates status to playing', () => {
      const state = reducer({}, {});
      const action = playCassette();

      const expectedState = {
        ...state,
        status: 'playing',
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(PAUSE_CASSETTE, () => {
    it('updates status to paused', () => {
      const state = reducer({}, {});
      const action = pauseCassette();

      const expectedState = {
        ...state,
        status: 'paused',
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(STOP_CASSETTE, () => {
    it('updates status to stopped', () => {
      const state = reducer({ status: 'playing' }, {});
      const action = stopCassette();

      const expectedState = {
        ...state,
        status: 'stopped',
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });
});
