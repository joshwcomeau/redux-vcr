import { combineReducers } from 'redux';

import actions from './actions.reducer';
import cassettes from './cassettes.reducer';
import play from './play.reducer';
import user from './user.reducer';

export default combineReducers({ actions, cassettes, play, user });
