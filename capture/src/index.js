import randkey from 'randkey';
import invariant from 'invariant';
import './polyfills.js';

import { isActionBlacklisted } from './helpers';

const generateCasette = (id = randkey.rand36()) => ({
  id,
  data: {},
  actions: [],
});

// eslint-disable-next-line import/prefer-default-export
export const captureMiddleware = ({
  blacklist = [],
  dataHandler,
  prefix = 'REDUX_VCR',
} = {}) => {
  const casette = generateCasette();

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

    // If the action has any metadata for us, apply it to the casette
    if (action.meta && action.meta.capture) {
      casette.data = {
        ...casette.data,
        ...action.meta.capture,
      };
    }

    const now = performance.now();
    const delay = now - timeSinceLastEvent;
    timeSinceLastEvent = now;

    casette.actions.push({
      ...action,
      delay,
    });

    dataHandler.persist(casette);

    return next(action);
  };
};
