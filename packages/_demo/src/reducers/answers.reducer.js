/* eslint-disable no-unused-vars */
import { combineReducers } from 'redux';
import { SELECT_ANSWER } from '../actions';

// NOTE: This is provided because this demo app is contrived.
// In a real app, we would have actions for populating this state.
const defaultAnswers = {
  hcl: 'Hillary Clinton',
  dtr: 'Donald Trump',
  gjo: 'Gary Johnson',
};

// Because we don't have ways of adding/removing answers,
// we don't even need the switch for these reducers.
const byId = (state = defaultAnswers, action) => state;
const allIds = (state = Object.keys(defaultAnswers), action) => state;

const selected = (state = null, action) => {
  switch (action.type) {
    case SELECT_ANSWER: return action.id;
    default: return state;
  }
};


export default combineReducers({ byId, allIds, selected });


export const getAnswers = state => (
  state.allIds.map(id => ({
    id,
    name: state.byId[id],
  }))
);
