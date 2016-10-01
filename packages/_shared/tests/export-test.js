import { expect } from 'chai';

import {
  actionTypes,
  actionCreators,
  actionsReducer,
  actionSelectors,
  cassettesReducer,
  cassetteSelectors,
  playReducer,
  playSelectors,
  userReducer,
  userSelectors,
  createFirebaseHandler,
} from '../src';


describe('shared export', () => {
  it('exports the action types', () => {
    expect(actionTypes).to.be.an('object');
    expect(actionTypes).to.include.keys([
      'CASSETTES_LIST_REQUEST',
      'CASSETTES_LIST_SUCCESS',
    ]);

    const numOfNonStrings = Object.keys(actionTypes).filter(key => (
      typeof actionTypes[key] !== 'string'
    ));

    expect(numOfNonStrings).to.have.length.of(0);
  });

  it('exports the action creators', () => {
    expect(actionCreators).to.be.an('object');
    expect(actionCreators).to.include.keys([
      'cassettesListRequest',
      'cassettesListSuccess',
    ]);

    const numOfNonFunctions = Object.keys(actionCreators).filter(key => (
      typeof actionCreators[key] !== 'function'
    ));

    expect(numOfNonFunctions).to.have.length.of(0);
  });

  it('exports all reducer functions', () => {
    // For most reducers, we use `combineReducers`, which creates functions
    // that don't really look like reducers.
    // The exception ATM is `user`, which uses a regular reducer.
    const combinedReducers = [
      actionsReducer,
      cassettesReducer,
      playReducer,
    ];

    const regularReducers = [
      userReducer,
    ];

    combinedReducers.forEach(reducer => {
      expect(reducer).to.be.a('function');
      expect(reducer.length).to.equal(0);
      expect(reducer.toString()).to.match(/combination\(\)/i);
    });

    regularReducers.forEach(reducer => {
      expect(reducer).to.be.a('function');
      expect(reducer.length).to.equal(2);
      expect(reducer.toString()).to.match(/reducer\(state, action\)/i);
    });
  });

  it('exports action selectors', () => {
    const selectors = Object.keys(actionSelectors).filter(selector => (
      selector !== 'default'
    ));

    expect(selectors).to.have.length.above(0);
    expect(selectors).to.include(
      'actionsListSelector'
    );
  });

  it('exports cassette selectors', () => {
    const selectors = Object.keys(cassetteSelectors).filter(selector => (
      selector !== 'default'
    ));

    expect(selectors).to.have.length.above(0);
    expect(selectors).to.include(
      'cassetteListSelector',
      'paginatedCassetteListSelector',
      'isFirstPageSelector',
      'isLastPageSelector'
    );
  });

  it('exports empty play selectors', () => {
    const selectors = Object.keys(playSelectors).filter(selector => (
      selector !== 'default'
    ));

    expect(selectors).to.have.length.of(0);
  });

  it('exports user selectors', () => {
    const selectors = Object.keys(userSelectors).filter(selector => (
      selector !== 'default'
    ));

    expect(selectors).to.have.length.of(0);
  });


  it('exports createFirebaseHandler', () => {
    expect(createFirebaseHandler).to.be.a('function');
  });
});
