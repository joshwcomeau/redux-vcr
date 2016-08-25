import { expect } from 'chai';
import sinon from 'sinon';
import { createStore } from 'redux';
// import { actionTypes } from 'redux-vcr.shared';
import { actionTypes, actionCreators } from '../../shared/src';

import { RetrieveHandler, createRetrieveMiddleware } from '../src';


const {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  CASSETTES_LIST_REQUEST,
  CASSETTES_LIST_SUCCESS,
  CASSETTE_ACTIONS_RECEIVE,
  SELECT_CASSETTE,
  SIGN_OUT_REQUEST,
} = actionTypes;

const {
  setAuthRequirement,
} = actionCreators;

const firebaseAuth = {
  apiKey: 'abc123',
  authDomain: 'test.firebaseapp.com',
  databaseURL: 'https://test.firebaseio.com',
};


describe('createRetrieveMiddleware', () => {
  describe('instantiation actions', () => {
    const dummyReducer = sinon.stub();
    const store = createStore(dummyReducer);
    const dataHandler = new RetrieveHandler({ firebaseAuth });

    sinon.stub(store, 'dispatch');

    afterEach(() => {
      store.dispatch.reset();
    });

    it('dispatches `setAuthRequirement`', () => {
      createRetrieveMiddleware({ dataHandler })(store);

      expect(store.dispatch.callCount).to.equal(1);
      expect(store.dispatch.firstCall.args[0]).to.deep.equal(
        setAuthRequirement({ requiresAuth: true })
      );
    });

    it('dispatches `setAuthRequirement` with false when set to false', () => {
      createRetrieveMiddleware({
        dataHandler,
        requiresAuth: false,
      })(store);

      expect(store.dispatch.callCount).to.equal(1);
      expect(store.dispatch.firstCall.args[0]).to.deep.equal(
        setAuthRequirement({ requiresAuth: false })
      );
    });
  });

  describe('handled actions', () => {
    const dataHandler = new RetrieveHandler({ firebaseAuth });
    const middleware = createRetrieveMiddleware({ dataHandler });
    const next = sinon.stub();

    sinon.spy(dataHandler, 'retrieveList');
    sinon.spy(dataHandler, 'retrieveActions');
    sinon.spy(dataHandler, 'signInWithPopup');

    afterEach(() => {
      next.reset();
      dataHandler.retrieveList.reset();
      dataHandler.retrieveActions.reset();
      dataHandler.signInWithPopup.reset();
    });

    it('forwards unrelated actions through the middleware', () => {
      const dummyReducer = sinon.stub();
      const store = createStore(dummyReducer);
      const action = { type: 'UNRELATED_BUSINESS' };
      middleware(store)(next)(action);

      expect(next.callCount).to.equal(1);
      expect(next.firstCall.args[0]).to.equal(action);
    });

    context(SIGN_IN_REQUEST, () => {
      const dummyReducer = sinon.stub();
      const store = createStore(dummyReducer);
      sinon.stub(store, 'dispatch');

      afterEach(() => {
        store.dispatch.reset();
      });

      it('throws when an invalid authMethod is provided', () => {
        expect(() => (
          middleware(store)(next)({
            type: SIGN_IN_REQUEST,
            authMethod: 'facebook.com',
          })
        )).to.throw(/github.com/);

        expect(dataHandler.signInWithPopup.callCount).to.equal(1);
        expect(next.callCount).to.equal(0);
      });

      it('directly dispatches a success method with user and credential', () => {
        middleware(store)(next)({
          type: SIGN_IN_REQUEST,
          authMethod: 'github.com',
        });

        expect(next.callCount).to.equal(0);
        expect(store.dispatch.callCount).to.equal(1);
      });
    });


    context(SIGN_IN_SUCCESS, () => {

    });


    context(CASSETTES_LIST_REQUEST, () => {
      const action = { type: CASSETTES_LIST_REQUEST };
      const dummyReducer = sinon.stub();
      const store = createStore(dummyReducer);

      beforeEach(() => {
        middleware(store)(next)(action);
      });

      it('invokes `retrieveList`', done => {
        expect(dataHandler.retrieveList.callCount).to.equal(1);

        // Adding a short delay, since the middleware is asynchronous.
        // Otherwise, it might complete during the next test, and throw off
        // our spy count.
        window.setTimeout(done, 10);
      });

      it('immediately dispatches the action', done => {
        expect(next.callCount).to.equal(1);
        expect(next.firstCall.args[0]).to.equal(action);

        window.setTimeout(done, 10);
      });

      it('asynchronously dispatches the `cassettesListSuccess` action', done => {
        window.setTimeout(() => {
          expect(next.callCount).to.equal(2);
          const receiveAction = next.secondCall.args[0];

          expect(receiveAction.type).to.equal(CASSETTES_LIST_SUCCESS);
          expect(receiveAction.cassettes).to.deep.equal([{ id: 'cassette1' }]);
          done();
        }, 10);
      });
    });


    context(SELECT_CASSETTE, () => {
      const cassetteId = 'cass1337';
      const initialState = {
        reduxVCR: {
          actions: {
            byId: {},
          },
        },
      };
      const reducer = function reducer(state = initialState) {
        return state;
      };
      const store = createStore(reducer);
      const action = { type: SELECT_CASSETTE, id: cassetteId };


      it('invokes `retrieveActions`', done => {
        middleware(store)(next)(action);

        expect(dataHandler.retrieveActions.callCount).to.equal(1);

        window.setTimeout(done, 10);
      });

      it('does not immediately dispatch the action', done => {
        middleware(store)(next)(action);

        expect(next.callCount).to.equal(0);
        window.setTimeout(done, 10);
      });

      it('asynchronously dispatches two actions', done => {
        middleware(store)(next)(action);

        window.setTimeout(() => {
          expect(next.callCount).to.equal(2);

          const receiveAction = next.firstCall.args[0];
          expect(receiveAction.type).to.equal(CASSETTE_ACTIONS_RECEIVE);
          expect(receiveAction.id).to.equal(cassetteId);
          expect(receiveAction.cassetteActions).to.be.an('array');

          const selectAction = next.secondCall.args[0];
          expect(selectAction).to.equal(action);
          done();
        }, 500);
      });

      it('does not invoke `retrieveActions` if it already has the actions', done => {
        const loadedState = {
          reduxVCR: {
            actions: {
              byId: {
                [cassetteId]: {},
              },
            },
          },
        };

        const loadedReducer = function loadedReducer(state = loadedState) {
          return state;
        };
        const loadedStore = createStore(loadedReducer);

        middleware(loadedStore)(next)(action);

        expect(dataHandler.retrieveActions.callCount).to.equal(0);

        window.setTimeout(done, 10);
      });
    });


    context(SIGN_OUT_REQUEST, () => {

    });
  });
});
