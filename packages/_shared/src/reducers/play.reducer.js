import { combineReducers } from 'redux';

import {
  CHANGE_PLAYBACK_SPEED,
  CHANGE_MAXIMUM_DELAY,
  EJECT_CASSETTE,
  PAUSE_CASSETTE,
  PLAY_CASSETTE,
  STOP_CASSETTE,
} from '../actions';


const defaultStates = {
  status: 'stopped',
  speed: 1,
  maximumDelay: Infinity,
};


function statusReducer(state = defaultStates.status, action) {
  switch (action.type) {
    case EJECT_CASSETTE:
    case STOP_CASSETTE: return 'stopped';
    case PAUSE_CASSETTE: return 'paused';
    case PLAY_CASSETTE: return 'playing';
    default: return state;
  }
}

function speedReducer(state = defaultStates.speed, action) {
  switch (action.type) {
    case CHANGE_PLAYBACK_SPEED: return action.playbackSpeed;
    default: return state;
  }
}

function maximumDelayReducer(state = defaultStates.maximumDelay, action) {
  switch (action.type) {
    case CHANGE_MAXIMUM_DELAY: return action.maximumDelay;
    default: return state;
  }
}


export default combineReducers({
  status: statusReducer,
  speed: speedReducer,
  maximumDelay: maximumDelayReducer,
});
