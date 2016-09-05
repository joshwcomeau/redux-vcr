/* eslint-disable object-property-newline */
import { expect } from 'chai';

import reducer from '../../src/reducers/cassettes.reducer';
import {
  CASSETTES_LIST_SUCCESS,
  EJECT_CASSETTE,
  GO_TO_NEXT_CASSETTE_PAGE,
  GO_TO_PREVIOUS_CASSETTE_PAGE,
  HIDE_CASSETTES,
  SELECT_CASSETTE,
  VIEW_CASSETTES,
  UPDATE_CASSETTE_INITIAL_STATE,
  cassettesListSuccess,
  ejectCassette,
  goToNextCassettePage,
  goToPreviousCassettePage,
  hideCassettes,
  selectCassette,
  viewCassettes,
  updateCassetteInitialState,
} from '../../src/actions';


describe('cassette reducer', () => {
  describe(CASSETTES_LIST_SUCCESS, () => {
    it('populates the list of cassettes', () => {
      const state = reducer({}, {});
      const action = cassettesListSuccess({ cassettes: {
        abc: '123',
        xyz: '789',
      } });

      const expectedState = {
        ...state,
        byId: {
          abc: '123',
          xyz: '789',
        },
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(EJECT_CASSETTE, () => {
    it('updates the casette status and selected', () => {
      const initialState = { selected: 'abc', status: 'loaded' };
      const state = reducer(initialState, {});
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
      } };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(GO_TO_PREVIOUS_CASSETTE_PAGE, () => {
    it('decrements the selected page', () => {
      const state = reducer({ page: { number: 5, limit: 5 } }, {});
      const action = goToPreviousCassettePage();

      const expectedState = { ...state, page: {
        number: 4,
        limit: 5,
      } };
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

  describe(SELECT_CASSETTE, () => {
    it('marks the cassette as selected, and the status as loaded', () => {
      const state = reducer({
        byId: {
          abc123: {},
          def456: {},
        },
      }, {});
      const action = selectCassette({ id: 'def456' });

      const expectedState = {
        ...state,
        selected: 'def456',
        status: 'loaded',
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(UPDATE_CASSETTE_INITIAL_STATE, () => {
    it('sets the new initialState for the currently-selected cassette', () => {
      const state = reducer({
        byId: {
          abc123: {
            label: 'hi',
            initialState: 5,
          },
          def456: {
            label: 'bye',
            initialState: 10,
          },
        },
        selected: 'def456',
      }, {});

      const action = updateCassetteInitialState({
        selected: 'def456',
        newState: 20,
      });

      const expectedState = {
        ...state,
        byId: {
          abc123: {
            label: 'hi',
            initialState: 5,
          },
          def456: {
            label: 'bye',
            initialState: 20,
          },
        },
        selected: 'def456',
      };
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
