import { expect } from 'chai';

import reducer from '../../src/reducers/actions.reducer';
import {
  CASSETTE_ACTIONS_RECEIVE,
  INCREMENT_ACTIONS_PLAYED,
  STOP_CASSETTE,
  cassetteActionsReceive,
  incrementActionsPlayed,
  stopCassette,
} from '../../src/actions';


describe('actions reducer', () => {
  describe(CASSETTE_ACTIONS_RECEIVE, () => {
    const cassetteActions = [
      { type: 'DO_THING', delay: 0 },
      { type: 'DO_OTHER_THING', delay: 0 },
    ]

    it('populates the list of actions', () => {
      const state = reducer({}, {});
      const action = cassetteActionsReceive({
        id: 'cba',
        cassetteActions,
      });

      const expectedState = {
        ...state,
        byId: {
          cba: cassetteActions,
        },
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });

    it("doesn't clobber other cassette's actions", () => {
      const state = reducer({
        byId: {
          zyx: [{ type: 'STUFF', delay: 10 }],
        },
      }, {});
      const action = cassetteActionsReceive({
        id: 'cba',
        cassetteActions,
      });

      const expectedState = {
        ...state,
        byId: {
          zyx: [{ type: 'STUFF', delay: 10 }],
          cba: cassetteActions,
        },
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(INCREMENT_ACTIONS_PLAYED, () => {
    it('increments currentIndex from a pre-existing value', () => {
      const state = reducer({ currentIndex: 5 }, {});
      const action = incrementActionsPlayed();

      const expectedState = {
        ...state,
        currentIndex: 6,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
    it('increments currentIndex from 0', () => {
      const state = reducer({}, {});
      const action = incrementActionsPlayed();

      const expectedState = {
        ...state,
        currentIndex: 1,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(STOP_CASSETTE, () => {
    it('resets currentIndex', () => {
      const state = reducer({ currentIndex: 5 }, {});
      const action = stopCassette();

      const expectedState = {
        ...state,
        currentIndex: 0,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });
});
