/* eslint-disable no-unused-vars */
import { expect } from 'chai';

import reducer from '../../src/reducers/authentication.reducer';
import {
  SIGN_IN_REQUEST,
  SIGN_IN_RECEIVE,
  SIGN_IN_FAILURE,
  SIGN_OUT,
  signInRequest,
  signInReceive,
  signInFailure,
  signOut,
} from '../../src/actions';


describe('authentication reducer', () => {
  describe('initialization', () => {
    it('populates with default values', () => {
      const initialState = reducer({}, {});
      const expectedState = {
        loggedIn: false,
        error: null,
      };

      expect(initialState).to.deep.equal(expectedState);
    });
  });

  describe(SIGN_IN_REQUEST, () => {
    it('removes any leftover errors', () => {
      const state = reducer({
        loggedIn: false,
        error: 'yadda',
      }, {});

      const action = signInRequest({ authMethod: 'github' });

      const expectedState = {
        loggedIn: false,
        error: null,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(SIGN_IN_RECEIVE, () => {
    it('resets the error and sets loggedIn to true', () => {
      const state = reducer({
        loggedIn: false,
        error: 'yadda',
      }, {});

      const action = signInReceive({ user: {} });

      const expectedState = {
        loggedIn: true,
        error: null,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(SIGN_IN_FAILURE, () => {
    it('sets the error', () => {
      const state = reducer({}, {});

      const action = signInFailure({ error: 'blew up' });

      const expectedState = {
        loggedIn: false,
        error: 'blew up',
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });


  describe(SIGN_OUT, () => {
    it('sets loggedIn to false', () => {
      const state = reducer({ loggedIn: true }, {});

      const action = signOut();

      const expectedState = {
        loggedIn: false,
        error: null,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });
});
