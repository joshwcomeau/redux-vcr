import { expect } from 'chai';
import sinon from 'sinon';

import reducer from '../src/reducers/cassettes.reducer';
import {
  CASSETTES_LIST_RECEIVE,
  EJECT_CASSETTE,
  GO_TO_NEXT_CASSETTE_PAGE,
  GO_TO_PREVIOUS_CASSETTE_PAGE,
  HIDE_CASSETTES,
  SELECT_CASSETTE,
  VIEW_CASSETTES,
  cassettesListReceive,
  ejectCassette,
  goToNextCassettePage,
  goToPreviousCassettePage,
  hideCassettes,selectCassette,
  viewCassettes,
} from '../src/actions';


describe('cassette reducer', () => {
  describe(CASSETTES_LIST_RECEIVE, () => {
    it('populates the list of cassettes', () => {
      const state = reducer({}, {});
      const action = cassettesListReceive({ cassettes: {
        abc: '123',
        xyz: '789',
      }});

      const expectedState = { ...state, byId: {
        abc: '123',
        xyz: '789',
      }};
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(EJECT_CASSETTE, () => {
    it('updates the casette status and selected', () => {
      const initialState = { selected: 'abc', status: 'loaded' }
      const state = reducer(state, {});
      const action = ejectCassette();

      const expectedState = {
        ...state,
        selected: null,
        status: 'idle',
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(GO_TO_NEXT_CASSETTE_PAGE, () => {
    it('increments the selected page', () => {
      const state = reducer({}, {});
      const action = goToNextCassettePage();

      const expectedState = { ...state, page: {
        number: 1,
        limit: 5,
      }};
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(GO_TO_PREVIOUS_CASSETTE_PAGE, () => {
    it('decrements the selected page', () => {
      const state = reducer({ page: { number: 5, limit: 5 }}, {});
      const action = goToPreviousCassettePage();

      const expectedState = { ...state, page: {
        number: 4,
        limit: 5,
      }};
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(HIDE_CASSETTES, () => {
    it('sets status to idle', () => {
      const state = reducer({ status: 'selecting' }, {});
      const action = hideCassettes();

      const expectedState = { ...state, status: 'idle' };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(VIEW_CASSETTES, () => {
    it('sets status to `selecting`', () => {
      const state = reducer({}, {});
      const action = viewCassettes();

      const expectedState = { ...state, status: 'selecting' };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

});
