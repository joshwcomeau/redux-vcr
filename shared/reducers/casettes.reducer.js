import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import {
  CASETTES_LIST_RECEIVE,
  EJECT_CASETTE,
  GO_TO_NEXT_CASETTE_PAGE,
  GO_TO_PREVIOUS_CASETTE_PAGE,
  HIDE_CASETTES,
  SELECT_CASETTE,
  VIEW_CASETTES,
} from '../vcr-actions';


const defaultStates = {
  status: 'idle',
  selected: null,
  byId: {},
  page: {
    number: 0,
    limit: 5,
  },
};


function statusReducer(state = defaultStates.status, action) {
  switch (action.type) {
    case VIEW_CASETTES: return 'selecting';
    case EJECT_CASETTE:
    case HIDE_CASETTES: return 'idle';
    case SELECT_CASETTE: return 'loaded';
    default: return state;
  }
}

function selectedReducer(state = defaultStates.selected, action) {
  switch (action.type) {
    case SELECT_CASETTE: return action.id;
    default: return state;
  }
}

function byIdReducer(state = defaultStates.byId, action) {
  switch (action.type) {
    case CASETTES_LIST_RECEIVE: return action.casettes;
    default: return state;
  }
}

function pageNumberReducer(state = defaultStates.page.number, action) {
  switch (action.type) {
    case GO_TO_NEXT_CASETTE_PAGE: return state + 1;
    case GO_TO_PREVIOUS_CASETTE_PAGE: return state - 1;
    default: return state;
  }
}

function pageLimitReducer(state = defaultStates.page.limit, action) {
  switch (action.type) {
    default: return state;
  }
}


export default combineReducers({
  status: statusReducer,
  selected: selectedReducer,
  byId: byIdReducer,
  page: combineReducers({
    number: pageNumberReducer,
    limit: pageLimitReducer,
  }),
});


// ////////////////////////
// SELECTORS /////////////
// //////////////////////
const casettesById = state => state.reduxVCR.casettes.byId;
const casettePageNumberSelector = state => state.reduxVCR.casettes.page.number;
const casettePageLimitSelector = state => state.reduxVCR.casettes.page.limit;

export const casetteListSelector = createSelector(
  casettesById,
  (casettes) => {
    const casetteIds = Object.keys(casettes);

    return casetteIds
      .map(id => ({ id, ...casettes[id] }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }
);

export const paginatedCasetteListSelector = createSelector(
  casetteListSelector,
  casettePageNumberSelector,
  casettePageLimitSelector,
  (casetteList, pageNumber, pageLimit) => {
    const startIndex = pageNumber * pageLimit;
    const endIndex = startIndex + pageLimit;

    return casetteList.slice(startIndex, endIndex);
  }
);

export const isFirstPageSelector = createSelector(
  casettePageNumberSelector,
  (pageNumber) => pageNumber === 0
);

export const isLastPageSelector = createSelector(
  casetteListSelector,
  casettePageNumberSelector,
  casettePageLimitSelector,
  (casetteList, pageNumber, pageLimit) => {
    const numOfCasettes = casetteList.length;
    const numOfPages = Math.floor(numOfCasettes / pageLimit);

    return pageNumber >= numOfPages;
  }
);
