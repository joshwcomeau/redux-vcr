import invariant from 'invariant';
import { errors } from 'redux-vcr.shared';

import { isActionBlacklisted } from './helpers';


// eslint-disable-next-line import/prefer-default-export
const createCaptureMiddleware = ({
  blacklist = [],
  persistHandler,
  startTrigger,
  minimumActionsToPersist = 0,
} = {}) => {
  const cassette = {
    timestamp: Date.now(),
    data: {},
    actions: [],
    initialState: {},
  };

  // Ensure that the data handler we've supplied is valid
  invariant(
    !!persistHandler && typeof persistHandler.persist === 'function',
    errors.captureMiddlewareGivenInvalidPersistHandler()
  );

  // In addition to any user-specified actions, we want to ignore any actions
  // emitted from ReduxVCR/replay.
  blacklist.push({ type: 'REDUX_VCR', matchingCriteria: 'startsWith' });

  // We've polyfilled performance.now to run in all environments.
  let timeSinceLastEvent = window.performance.now();

  let waitingForActionToStartCapturing = typeof startTrigger !== 'undefined';

  // eslint-disable-next-line no-unused-vars
  return store => next => action => {
    if (waitingForActionToStartCapturing && action.type === startTrigger) {
      // If so, we want to dispatch it, so that the state is updated,
      // and then use the newly-computed state as our baseline.
      next(action);

      cassette.timestamp = Date.now();
      cassette.initialState = { ...store.getState() };
      delete cassette.initialState.reduxVCR;

      timeSinceLastEvent = window.performance.now();
      waitingForActionToStartCapturing = false;

      // Bail out early. We don't want to persist the cassette yet,
      // since there are no recorded actions.
      return null;
    }

    if (waitingForActionToStartCapturing) {
      return next(action);
    }

    if (isActionBlacklisted({ action, blacklist })) {
      return next(action);
    }

    // If the action has any metadata for us, apply it to the cassette
    if (action.meta && action.meta.capture) {
      cassette.data = {
        ...cassette.data,
        ...action.meta.capture,
      };
    }

    const now = window.performance.now();
    const delay = now - timeSinceLastEvent;
    timeSinceLastEvent = now;

    cassette.actions.push({
      ...action,
      delay,
    });

    if (cassette.actions.length >= minimumActionsToPersist) {
      persistHandler.persist(cassette);
    }

    return next(action);
  };
};

export default createCaptureMiddleware;
