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
  FirebaseHandler,
} from '../src';


describe('shared export', () => {
  it('exports the action types', () => {
    expect(actionTypes).to.be.an('object');
    expect(actionTypes).to.include.keys([
      'CASSETTES_LIST_REQUEST',
      'CASSETTES_LIST_RECEIVE',
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
      'cassettesListReceive',
    ]);

    const numOfNonFunctions = Object.keys(actionCreators).filter(key => (
      typeof actionCreators[key] !== 'function'
    ));

    expect(numOfNonFunctions).to.have.length.of(0);
  });

  it('exports all reducer functions', () => {
    const reducers = [actionsReducer, cassettesReducer, playReducer];

    reducers.forEach(reducer => {
      expect(reducer).to.be.a('function');
      // We use combineReducers, which produces functions that do not
      // quite look like reducers. TO ensure these are the right functions,
      // we'll do a match on their function body.
      expect(reducer.length).to.equal(0);
      expect(reducer.toString()).to.match(/combination()/i);
    });
  });

  it('exports empty action selectors', () => {
    const selectors = Object.keys(actionSelectors).filter(selector => (
      selector !== 'default'
    ));

    expect(selectors).to.have.length.of(0);
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

  it('exports FirebaseHandler', () => {
    expect(FirebaseHandler).to.be.a('function');
  });
});
