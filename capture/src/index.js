import invariant from 'invariant';
import './polyfills.js';

import { isActionBlacklisted } from './helpers';

const generateCassette = () => ({
  data: {},
  actions: [],
});

// eslint-disable-next-line import/prefer-default-export
export const captureMiddleware = ({
  blacklist = [],
  dataHandler,
  prefix = 'REDUX_VCR',
} = {}) => {
  const cassette = generateCassette();

  // Ensure that the data handler we've supplied is valid
  invariant(
    !!dataHandler && typeof dataHandler.persist === 'function',
    `Please supply a valid dataHandler to ReduxVCR/capture middleware.
    A valid dataHandler implements a 'persist' method for syncing to a
    database.

    For more information, see PLACEHOLDER.`
  );

  // In addition to any user-specified actions, we want to ignore any actions
  // emitted from ReduxVCR/replay.
  blacklist.push({ type: prefix, matchingCriteria: 'startsWith' });

  // We've polyfilled performance.now to run in all environments.
  let timeSinceLastEvent = performance.now();

  // eslint-disable-next-line no-unused-vars
  return store => next => action => {
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

    const now = performance.now();
    const delay = now - timeSinceLastEvent;
    timeSinceLastEvent = now;

    cassette.actions.push({
      ...action,
      delay,
    });

    dataHandler.persist(cassette);

    return next(action);
  };
};
