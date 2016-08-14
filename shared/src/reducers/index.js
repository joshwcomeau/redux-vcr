import { combineReducers } from 'redux';

import actions from './actions.reducer';
import cassettes from './cassettes.reducer';
import play from './play.reducer';

export default combineReducers({ actions, cassettes, play });
