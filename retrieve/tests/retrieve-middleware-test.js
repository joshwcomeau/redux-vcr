import { expect } from 'chai';
import sinon from 'sinon';

import { RetrieveHandler, retrieveMiddleware } from '../src';
import {
  CASSETTES_LIST_REQUEST,
  CASSETTES_LIST_RECEIVE,
  CASSETTE_ACTIONS_RECEIVE,
  SELECT_CASSETTE,
} from '../../shared/lib/actions';


const firebaseAuth = {
  apiKey: 'abc123',
  authDomain: 'test.firebaseapp.com',
  databaseURL: 'https://test.firebaseio.com',
};

describe('retrieveMiddleware', () => {
  const dataHandler = new RetrieveHandler({ firebaseAuth });
  const middleware = retrieveMiddleware(dataHandler);
  const store = {};
  const next = sinon.stub();

  sinon.spy(dataHandler, 'retrieveList');
  sinon.spy(dataHandler, 'retrieveActions');

  afterEach(() => {
    next.reset();
    dataHandler.retrieveList.reset();
    dataHandler.retrieveActions.reset();
  });

  it('forwards unrelated actions through the middleware', () => {
    const action = { type: 'UNRELATED_BUSINESS' };
    middleware(store)(next)(action);

    expect(next.callCount).to.equal(1);
    expect(next.firstCall.args[0]).to.equal(action);
  });

  context(CASSETTES_LIST_REQUEST, () => {
    let action;
    beforeEach(() => {
      action = { type: CASSETTES_LIST_REQUEST };
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

    it('asynchronously dispatches the `cassettesListReceive` action', done => {
      window.setTimeout(() => {
        expect(next.callCount).to.equal(2);
        const receiveAction = next.secondCall.args[0];

        expect(receiveAction.type).to.equal(CASSETTES_LIST_RECEIVE);
        expect(receiveAction.cassettes).to.deep.equal([{ id: 'cassette1' }]);
        done();
      }, 10);
    });
  });

  context(SELECT_CASSETTE, () => {
    const cassetteId = 'cass1337';
    const action = { type: SELECT_CASSETTE, id: cassetteId };
    const emptyStore = {
      getState() {
        return {
          reduxVCR: {
            actions: {
              byId: {},
            },
          },
        };
      },
    };
    const fullStore = {
      getState() {
        return {
          reduxVCR: {
            actions: {
              byId: {
                [cassetteId]: {},
              },
            },
          },
        };
      },
    };

    it('invokes `retrieveActions`', done => {
      middleware(emptyStore)(next)(action);

      expect(dataHandler.retrieveActions.callCount).to.equal(1);

      window.setTimeout(done, 10);
    });

    it('does not immediately dispatch the action', done => {
      middleware(emptyStore)(next)(action);

      expect(next.callCount).to.equal(0);
      window.setTimeout(done, 10);
    });

    it('asynchronously dispatches two actions', done => {
      middleware(emptyStore)(next)(action);

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
      middleware(fullStore)(next)(action);

      expect(dataHandler.retrieveActions.callCount).to.equal(0);

      window.setTimeout(done, 10);
    });
  });
});
