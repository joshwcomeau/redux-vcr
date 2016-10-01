import { expect } from 'chai';
import sinon from 'sinon';
import { createStore } from 'redux';
import { actionTypes, actionCreators } from 'redux-vcr.shared';

import { createRetrieveHandler, createRetrieveMiddleware } from '../src';


const {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  CASSETTES_LIST_REQUEST,
  CASSETTES_LIST_SUCCESS,
  CASSETTE_ACTIONS_RECEIVE,
  SELECT_CASSETTE,
  SIGN_OUT_REQUEST,
} = actionTypes;

const {
  setAuthRequirement,
  selectCassette,
} = actionCreators;

const firebaseAuth = {
  apiKey: 'abc123',
  authDomain: 'test.firebaseapp.com',
  databaseURL: 'https://test.firebaseio.com',
};


describe('createRetrieveMiddleware', () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe('instantiation actions', () => {
    const dummyReducer = sinon.stub();
    const store = createStore(dummyReducer);
    const retrieveHandler = createRetrieveHandler({ firebaseAuth });

    sinon.stub(store, 'dispatch');

    afterEach(() => {
      store.dispatch.reset();
    });

    it('dispatches `setAuthRequirement`', () => {
      createRetrieveMiddleware({ retrieveHandler })(store);

      expect(store.dispatch.callCount).to.equal(1);
      expect(store.dispatch.firstCall.args[0]).to.deep.equal(
        setAuthRequirement({ requiresAuth: true })
      );
    });

    it('dispatches `setAuthRequirement` with false when set to false', () => {
      createRetrieveMiddleware({
        retrieveHandler,
        requiresAuth: false,
      })(store);

      expect(store.dispatch.callCount).to.equal(1);
      expect(store.dispatch.firstCall.args[0]).to.deep.equal(
        setAuthRequirement({ requiresAuth: false })
      );
    });
  });

  describe('remembered credentials', () => {
    const dummyReducer = sinon.stub();
    const store = createStore(dummyReducer);
    const retrieveHandler = createRetrieveHandler({ firebaseAuth });

    sinon.spy(store, 'dispatch');

    context('when no app name is given', () => {
      const localStorageKey = 'redux-vcr-app';

      afterEach(() => {
        store.dispatch.reset();
      });

      it('dispatches `signInFailure` when the credential is invalid', done => {
        localStorage.setItem(localStorageKey, JSON.stringify({
          accessToken: 'bad-credential',
          provider: 'github.com',
        }));

        createRetrieveMiddleware({ retrieveHandler })(store);

        setTimeout(() => {
          // The first call is to SET_AUTH_REQUIREMENT, tested earlier
          expect(store.dispatch.callCount).to.equal(2);

          const actionType = store.dispatch.secondCall.args[0].type;
          expect(actionType).to.equal(SIGN_IN_FAILURE);

          done();
        }, 10);
      });

      it('dispatches `signInSuccess`', done => {
        localStorage.setItem(localStorageKey, JSON.stringify({
          accessToken: 'good-credential',
          provider: 'github.com',
        }));

        createRetrieveMiddleware({ retrieveHandler })(store);

        setTimeout(() => {
          expect(store.dispatch.callCount).to.equal(2);

          const actionType = store.dispatch.secondCall.args[0].type;
          expect(actionType).to.equal(SIGN_IN_SUCCESS);

          done();
        }, 10);
      });
    });

    context('when a specific app name is given', () => {
      const appName = 'coolApp';
      const localStorageKey = `redux-vcr-${appName}`;

      afterEach(() => {
        store.dispatch.reset();
      });

      it('dispatches `signInFailure` when the credential is invalid', done => {
        localStorage.setItem(localStorageKey, JSON.stringify({
          accessToken: 'bad-credential',
          provider: 'github.com',
        }));

        createRetrieveMiddleware({ retrieveHandler, appName })(store);

        setTimeout(() => {
          expect(store.dispatch.callCount).to.equal(2);

          const actionType = store.dispatch.secondCall.args[0].type;
          expect(actionType).to.equal(SIGN_IN_FAILURE);

          done();
        }, 10);
      });

      it('dispatches `signInSuccess`', done => {
        localStorage.setItem(localStorageKey, JSON.stringify({
          accessToken: 'good-credential',
          provider: 'github.com',
        }));

        createRetrieveMiddleware({ retrieveHandler, appName })(store);

        setTimeout(() => {
          expect(store.dispatch.callCount).to.equal(2);

          const actionType = store.dispatch.secondCall.args[0].type;
          expect(actionType).to.equal(SIGN_IN_SUCCESS);

          done();
        }, 10);
      });
    });
  });

  describe('handled actions', () => {
    const initialCassetteId = 'abc1234';
    const retrieveHandler = createRetrieveHandler({ firebaseAuth });
    const middleware = createRetrieveMiddleware({ retrieveHandler });
    const middlewareWithInitialCassette = createRetrieveMiddleware({
      retrieveHandler,
      initialCassetteId,
    });
    const next = sinon.stub();

    sinon.spy(retrieveHandler, 'retrieveList');
    sinon.spy(retrieveHandler, 'retrieveActions');
    sinon.spy(retrieveHandler, 'signInWithPopup');

    afterEach(() => {
      next.reset();
      retrieveHandler.retrieveList.reset();
      retrieveHandler.retrieveActions.reset();
      retrieveHandler.signInWithPopup.reset();
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

        expect(retrieveHandler.signInWithPopup.callCount).to.equal(1);
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
      const dummyReducer = sinon.stub();
      const store = createStore(dummyReducer);
      const action = {
        type: SIGN_IN_SUCCESS,
        credential: {
          accessToken: 'abc123',
          provider: 'github.com',
        },
      };

      sinon.spy(localStorage, 'setItem');

      beforeEach(() => {
        localStorage.setItem.reset();
        middleware(store)(next)(action);
      });

      afterEach(() => {
        next.reset();
      });

      after(() => {
        localStorage.setItem.restore();
      });

      it('passes the action onto the store', () => {
        expect(next.callCount).to.equal(1);
        expect(next.firstCall.args[0]).to.deep.equal(action);
      });

      it('writes to localStorage', () => {
        expect(localStorage.setItem.callCount).to.equal(1);

        const [appName, stringifiedCreds] = localStorage.setItem.firstCall.args;
        expect(stringifiedCreds).to.equal(JSON.stringify(action.credential));
      });
    });


    context(CASSETTES_LIST_REQUEST, () => {
      const action = { type: CASSETTES_LIST_REQUEST };
      const initialState = {
        reduxVCR: {
          cassettes: {
            byId: {},
          },
        },
      };
      const reducer = (state = initialState) => state;
      const store = createStore(reducer);
      const dispatchSpy = sinon.spy(store, 'dispatch');

      afterEach(() => {
        dispatchSpy.reset();
      });

      context('with no initial cassette', () => {
        beforeEach(() => {
          middleware(store)(next)(action);
        });

        it('invokes `retrieveList`', done => {
          expect(retrieveHandler.retrieveList.callCount).to.equal(1);

          // Adding a short delay, since the middleware is asynchronous.
          // Otherwise, it might complete during the next test, and throw off
          // our spy count.
          setTimeout(done, 10);
        });

        it('immediately dispatches the action', done => {
          expect(next.callCount).to.equal(1);
          expect(next.firstCall.args[0]).to.equal(action);

          setTimeout(done, 10);
        });

        it('asynchronously dispatches the `cassettesListSuccess` action', done => {
          setTimeout(() => {
            expect(next.callCount).to.equal(2);
            const receiveAction = next.secondCall.args[0];

            expect(receiveAction.type).to.equal(CASSETTES_LIST_SUCCESS);
            expect(receiveAction.cassettes).to.deep.equal([{ id: 'cassette1' }]);
            done();
          }, 10);
        });

        it('does not dispatch the `selectCassette` action', done => {
          setTimeout(() => {
            expect(dispatchSpy.callCount).to.equal(1);
            expect(
              dispatchSpy.firstCall.args[0]
            ).to.deep.equal(
              setAuthRequirement({ requiresAuth: true })
            );
            done();
          }, 10);
        });
      });

      context('with an initial cassette', () => {
        it('dispatches `selectCassette` with the initial cassette ID', done => {
          middlewareWithInitialCassette(store)(next)(action);

          setTimeout(() => {
            expect(dispatchSpy.callCount).to.equal(2);
            expect(
              dispatchSpy.firstCall.args[0]
            ).to.deep.equal(
              setAuthRequirement({ requiresAuth: true })
            );
            expect(
              dispatchSpy.secondCall.args[0]
            ).to.deep.equal(
              selectCassette({ id: initialCassetteId })
            );
            done();
          }, 10);
        });

        it('does not dispatch `selectCassette` when cassettes are already loaded', done => {
          const loadedInitialState = {
            reduxVCR: {
              cassettes: {
                byId: {
                  abc: '123',
                },
              },
            },
          };
          const loadedReducer = (state = loadedInitialState) => state;
          const loadedStore = createStore(loadedReducer);
          const loadedDispatchSpy = sinon.spy(loadedStore, 'dispatch');

          middlewareWithInitialCassette(loadedStore)(next)(action);
          setTimeout(() => {
            expect(loadedDispatchSpy.callCount).to.equal(1);
            expect(
              loadedDispatchSpy.firstCall.args[0]
            ).to.deep.equal(
              setAuthRequirement({ requiresAuth: true })
            );
            done();
          }, 10);
        });
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
      const reducer = (state = initialState) => state;
      const store = createStore(reducer);
      const action = { type: SELECT_CASSETTE, id: cassetteId };


      it('invokes `retrieveActions`', done => {
        middleware(store)(next)(action);

        expect(retrieveHandler.retrieveActions.callCount).to.equal(1);

        setTimeout(done, 10);
      });

      it('does not immediately dispatch the action', done => {
        middleware(store)(next)(action);

        expect(next.callCount).to.equal(0);
        setTimeout(done, 10);
      });

      it('asynchronously dispatches two actions', done => {
        middleware(store)(next)(action);

        setTimeout(() => {
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

        expect(retrieveHandler.retrieveActions.callCount).to.equal(0);

        setTimeout(done, 10);
      });
    });


    context(SIGN_OUT_REQUEST, () => {

    });
  });
});
