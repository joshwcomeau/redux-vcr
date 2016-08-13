import { combineReducers } from 'redux';

import {
  CHANGE_PLAYBACK_SPEED,
  EJECT_CASETTE,
  PAUSE_CASETTE,
  PLAY_CASETTE,
  STOP_CASETTE,
} from '../vcr-actions';


const defaultStates = {
  status: 'stopped',
  speed: 1,
};


function statusReducer(state = defaultStates.status, action) {
  switch (action.type) {
    case EJECT_CASETTE:
    case STOP_CASETTE: return 'stopped';
    case PAUSE_CASETTE: return 'paused';
    case PLAY_CASETTE: return 'playing';
    default: return state;
  }
}

function speedReducer(state = defaultStates.speed, action) {
  switch (action.type) {
    case CHANGE_PLAYBACK_SPEED: return action.playbackSpeed;
    default: return state;
  }
}


export default combineReducers({
  status: statusReducer,
  speed: speedReducer,
});
