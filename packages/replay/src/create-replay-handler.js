import { actionCreators } from 'redux-vcr.shared';

const { incrementActionsPlayed, stopCassette } = actionCreators;


export default function createReplayHandler() {
  const replayHandler = {
    play({ store, next }) {
      const state = store.getState().reduxVCR;

      // If no cassette is selected, we cannot possibly play it.
      const selectedId = state.cassettes.selected;
      if (selectedId === null || typeof selectedId === 'undefined') {
        return;
      }

      const { status, maximumDelay } = state.play;

      // if the cassette has stopped playing, we can bail.
      if (status !== 'playing') {
        return;
      }

      const { currentIndex } = state.actions;
      const actions = state.actions.byId[selectedId];
      const [currentAction, nextAction] = actions.slice(currentIndex);

      next(currentAction);
      next(incrementActionsPlayed());

      // If we're at the end of the cassette, set status to stopped.
      if (currentIndex === (actions.length - 1)) {
        next(stopCassette());
        return;
      }

      // handle any playbackSpeed config.
      // The value is expressed as a speed multiplier - eg. 2x, 0.5x.
      // Because we're dealing with delay, not speed, we want to invert it.
      // eg. a 2x speed increase = a 0.5x delay decrease
      const playbackMultiplier = 1 / state.play.speed;
      let delay = nextAction.delay * playbackMultiplier;

      // If our delay is larger than our maximum specified delay,
      // clamp it to that max.
      if (delay > maximumDelay) {
        delay = maximumDelay;
      }

      setTimeout(
        () => replayHandler.play({ store, next }),
        delay
      );
    },
  };

  return replayHandler;
}
