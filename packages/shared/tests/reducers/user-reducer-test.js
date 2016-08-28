/* eslint-disable no-unused-vars */
import { expect } from 'chai';

import reducer from '../../src/reducers/user.reducer';
import {
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  signInSuccess,
  signOutSuccess,
} from '../../src/actions';


describe('user reducer', () => {
  describe(SIGN_IN_SUCCESS, () => {
    it('updates the state with the user data', () => {
      const state = reducer({}, {});

      // TODO: Figure out what Firebase actually returns for these calls.
      const action = signInSuccess({ user: {
        uid: '1234',
      } });

      const expectedState = {
        uid: '1234',
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(SIGN_OUT_SUCCESS, () => {
    it('removes the user data', () => {
      const state = reducer({}, {});

      const action = signOutSuccess();

      const expectedState = null;
      const actualState = reducer(state, action);

      expect(actualState).to.equal(expectedState);
    });
  });
});
