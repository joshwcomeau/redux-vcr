import { expect } from 'chai';
import sinon from 'sinon';

import { createCaptureMiddleware } from '../src';


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('createCaptureMiddleware', () => {
  const persistHandler = { persist: sinon.stub() };
  const middlewareParams = {
    persistHandler,
  };
  const middleware = createCaptureMiddleware(middlewareParams);
  const store = {};
  const next = sinon.stub();
  const action = { type: 'USERS/ADD_NEW' };
  const blacklistedAction = { type: 'REDUX_VCR/PLAY_CASSETTE' };

  afterEach(() => {
    persistHandler.persist.reset();
    next.reset();
  });

  it('forwards unrelated actions through the middleware', () => {
    const action = { type: 'UNRELATED_BUSINESS' };
    middleware(store)(next)(action);

    expect(next.callCount).to.equal(1);
    expect(next.firstCall.args[0]).to.equal(action);
  });

  context('with invalid arguments', () => {
    it('throws when no persistHandler is provided', () => {
      expect(createCaptureMiddleware).to.throw(/persistHandler/);
    });

    it('throws when the persistHandler "persist" method is not a function', () => {
      const invalidDataHandler = { persist: 'hi there' };

      expect(
        () => createCaptureMiddleware({ persistHandler: invalidDataHandler })
      ).to.throw(/persistHandler/);
    });
  });

  context('persisting actions', () => {
    it('does not try to persist a REDUX_VCR action', () => {
      middleware(store)(next)(blacklistedAction);

      expect(persistHandler.persist.callCount).to.equal(0);
      expect(next.callCount).to.equal(1);
    });

    it('does persist a valid action', () => {
      middleware(store)(next)(action);

      expect(persistHandler.persist.callCount).to.equal(1);
      expect(next.callCount).to.equal(1);
    });
  });


  context('cassette metadata', () => {
    it('adds metadata to the cassette', () => {
      const actionWithData = {
        ...action,
        meta: {
          capture: {
            label: 'giorgio_tsoukalos@ancientaliens.com',
          },
        },
      };

      middleware(store)(next)(actionWithData);

      const [cassette] = persistHandler.persist.firstCall.args;

      expect(cassette.data).to.deep.equal(actionWithData.meta.capture);
    });

    it('merges in other data', () => {
      const otherActionWithData = {
        ...action,
        meta: {
          capture: {
            profession: 'Ancient Alien Theorist',
          },
        },
      };
      middleware(store)(next)(otherActionWithData);

      const [cassette] = persistHandler.persist.firstCall.args;

      expect(cassette.data).to.deep.equal({
        label: 'giorgio_tsoukalos@ancientaliens.com',
        profession: 'Ancient Alien Theorist',
      });
    });
  });

  context('timing', () => {
    // Since we'll be dealing with time, create a new middleware for these tests
    const freshMiddleware = createCaptureMiddleware(middlewareParams);

    it('records the delay between actions', async function(done) {
      freshMiddleware(store)(next)(action);

      await delay(500);
      freshMiddleware(store)(next)(action);

      await delay(500);
      freshMiddleware(store)(next)(action);

      expect(persistHandler.persist.callCount).to.equal(3);

      const [cassette] = persistHandler.persist.firstCall.args;
      const { actions } = cassette;
      const [firstAction, secondAction, thirdAction] = actions;

      // Note that the delay is not the time since the beginning,
      // it's the time since the previous action.
      // For this reason, secondAction and thirdAction should have near-
      // identical delays.

      // Add some wiggle-room, because Travis CI is not always super precise.
      expect(firstAction.delay).to.be.within(0, 150);
      expect(secondAction.delay).to.be.within(490, 600);
      expect(thirdAction.delay).to.be.within(490, 600);

      done();
    });
  });
});
