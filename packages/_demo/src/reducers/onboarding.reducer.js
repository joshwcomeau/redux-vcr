/* eslint-disable no-unused-vars */
import { combineReducers } from 'redux';
import { COMPLETE_ONBOARDING } from '../actions';

const defaultStates = {
  completed: false,
};

const completed = (state = defaultStates.completed, action) => {
  switch (action.type) {
    case COMPLETE_ONBOARDING: return true;
    default: return state;
  }
};


export default combineReducers({ completed });
