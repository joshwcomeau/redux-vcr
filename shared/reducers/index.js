import { combineReducers } from 'redux';

import actions from './actions.reducer';
import casettes from './casettes.reducer';
import play from './play.reducer';

export default combineReducers({ actions, casettes, play });
