import {
  incrementActionsPlayed,
  stopCassette,
} from '../../shared/actions';

export default function playActions({ store, next }) {
  const state = store.getState().reduxVCR;
  const selectedCassetteId = state.cassettes.selected;

  const { status } = state.play;
  const { currentIndex } = state.actions;

  const actions = state.actions.byId[selectedCassetteId];

  if (status !== 'playing') {
    return;
  }

  // Dispatch the next action immediately, and increment the number played.
  const [currentAction, nextAction] = actions.slice(currentIndex);

  next(currentAction);
  next(incrementActionsPlayed());

  // If we're at the end of the cassette, set status to stopped.
  if (currentIndex === (actions.length - 1)) {
    next(stopCassette());
    return;
  }

  window.setTimeout(
    () => playActions({ store, next }),
    // TODO: Implement playbackSpeed here
    nextAction.delay
  );
}
