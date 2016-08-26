/* eslint-disable no-unused-vars */
import { expect } from 'chai';

import reducer from '../../src/reducers/authentication.reducer';
import {
  SET_AUTH_REQUIREMENT,
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT_SUCCESS,
  setAuthRequirement,
  signInRequest,
  signInSuccess,
  signInFailure,
  signOutSuccess,
} from '../../src/actions';


describe('authentication reducer', () => {
  describe('initialization', () => {
    it('populates with default values', () => {
      const initialState = reducer({}, {});
      const expectedState = {
        loggedIn: false,
        error: null,
        requiresAuth: true,
      };

      expect(initialState).to.deep.equal(expectedState);
    });
  });

  describe(SET_AUTH_REQUIREMENT, () => {
    it('updates `requiresAuth`', () => {
      const state = reducer({}, {});

      const action = setAuthRequirement({ requiresAuth: false });

      const expectedState = {
        loggedIn: false,
        error: null,
        requiresAuth: false,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(SIGN_IN_REQUEST, () => {
    it('removes any leftover errors', () => {
      const state = reducer({
        loggedIn: false,
        error: 'yadda',
      }, {});

      const action = signInRequest({ authMethod: 'github.com' });

      const expectedState = {
        loggedIn: false,
        error: null,
        requiresAuth: true,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(SIGN_IN_SUCCESS, () => {
    it('resets the error and sets loggedIn to true', () => {
      const state = reducer({
        loggedIn: false,
        error: 'yadda',
      }, {});

      const action = signInSuccess({ user: {} });

      const expectedState = {
        loggedIn: true,
        error: null,
        requiresAuth: true,
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
        requiresAuth: true,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });


  describe(SIGN_OUT_SUCCESS, () => {
    it('sets loggedIn to false', () => {
      const state = reducer({ loggedIn: true }, {});

      const action = signOutSuccess();

      const expectedState = {
        loggedIn: false,
        error: null,
        requiresAuth: true,
      };
      const actualState = reducer(state, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });
});
