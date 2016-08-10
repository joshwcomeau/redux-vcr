import uuid from 'node-uuid';
import './polyfills.js';

import { isActionBlacklisted } from './helpers';

// eslint-disable-next-line import/prefer-default-export
export const captureMiddleware = ({ blacklist }) => {
  const casette = {
    id: uuid.v4(),
    data: {},
    actions: [],
  };

  // In addition to any user-specified actions, we want to ignore any actions
  // emitted from ReduxVCR/replay.
  // TODO Allow the ReduxVCR/replay prefix to be manually specified?
  const replayPrefix = 'REDUX_VCR/';
  blacklist.push(replayPrefix);

  // We've polyfilled performance.now to run in all environments.
  let timeSinceLastEvent = performance.now();

  // eslint-disable-next-line no-unused-vars
  return store => next => action => {
    if (isActionBlacklisted({ action, blacklist })) {
      return next(action);
    }

    // If the action has any metadata for us, apply it to the casette,
    // and then remove it from the action.
    if (action.meta && action.meta.capture) {
      casette.data = {
        ...casette.data,
        ...action.meta.capture,
      };

      // eslint-disable-next-line no-param-reassign
      delete action.meta.capture;
    }

    const now = performance.now();

    casette.actions.push({
      ...action,
      delay: now - timeSinceLastEvent,
    });

    timeSinceLastEvent = now;

    return next(action);
  };
};
