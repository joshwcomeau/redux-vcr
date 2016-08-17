/* eslint-disable no-unused-vars */
import { expect } from 'chai';

import reducer from '../../src/reducers/user.reducer';
import {
  SIGN_IN_REQUEST,
  SIGN_IN_RECEIVE,
  SIGN_IN_FAILURE,
  signInRequest,
  signInReceive,
  signInFailure,
} from '../../src/actions';


describe('user reducer', () => {
  describe(SIGN_IN_RECEIVE, () => {
    it('updates the state with the user data', () => {
      const state = reducer({}, {});

      // TODO: Figure out what Firebase actually returns for these calls.
      const action = signInReceive({ user: {
        uid: '1234',
      } });

      const expectedState = {
        uid: '1234',
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });
});
