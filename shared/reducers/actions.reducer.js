import { combineReducers } from 'redux';

import {
  CASETTE_ACTIONS_RECEIVE,
  INCREMENT_ACTIONS_PLAYED,
  STOP_CASETTE,
} from '../vcr-actions';


const defaultStates = {
  byId: {},
  currentIndex: 0,
};


function byIdReducer(state = defaultStates.byId, action) {
  switch (action.type) {
    case CASETTE_ACTIONS_RECEIVE:
      return {
        ...state,
        [action.id]: action.casetteActions,
      };
    default: return state;
  }
}

function currentIndexReducer(state = defaultStates.currentIndex, action) {
  switch (action.type) {
    case INCREMENT_ACTIONS_PLAYED: return state + 1;
    case STOP_CASETTE: return 0;
    default: return state;
  }
}


export default combineReducers({
  byId: byIdReducer,
  currentIndex: currentIndexReducer,
});
