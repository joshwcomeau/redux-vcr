import { combineReducers } from 'redux';

import {
  CASSETTE_ACTIONS_RECEIVE,
  INCREMENT_ACTIONS_PLAYED,
  STOP_CASSETTE,
} from '../actions';


const defaultStates = {
  byId: {},
  currentIndex: 0,
};


function byIdReducer(state = defaultStates.byId, action) {
  switch (action.type) {
    case CASSETTE_ACTIONS_RECEIVE:
      return {
        ...state,
        [action.id]: action.cassetteActions,
      };
    default: return state;
  }
}

function currentIndexReducer(state = defaultStates.currentIndex, action) {
  switch (action.type) {
    case INCREMENT_ACTIONS_PLAYED: return state + 1;
    case STOP_CASSETTE: return 0;
    default: return state;
  }
}


export default combineReducers({
  byId: byIdReducer,
  currentIndex: currentIndexReducer,
});
