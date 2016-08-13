export const CASETTES_LIST_REQUEST = 'VCR_PLAYER/CASETTES_LIST_REQUEST';
export const CASETTES_LIST_RECEIVE = 'VCR_PLAYER/CASETTES_LIST_RECEIVE';
export const CASETTES_LIST_FAILURE = 'VCR_PLAYER/CASETTES_LIST_FAILURE';
export const VIEW_CASETTES = 'VCR_PLAYER/VIEW_CASETTES';
export const HIDE_CASETTES = 'VCR_PLAYER/HIDE_CASETTES';
export const SELECT_CASETTE = 'VCR_PLAYER/SELECT_CASETTE';
export const EJECT_CASETTE = 'VCR_PLAYER/EJECT_CASETTE';
export const PLAY_CASETTE = 'VCR_PLAYER/PLAY_CASETTE';
export const PAUSE_CASETTE = 'VCR_PLAYER/PAUSE_CASETTE';
export const STOP_CASETTE = 'VCR_PLAYER/STOP_CASETTE';
export const REWIND_CASETTE_AND_RESTORE_APP = 'VCR_PLAYER/REWIND_CASETTE_AND_RESTORE_APP';
export const GO_TO_NEXT_CASETTE_PAGE = 'VCR_PLAYER/GO_TO_NEXT_CASETTE_PAGE';
export const GO_TO_PREVIOUS_CASETTE_PAGE = 'VCR_PLAYER/GO_TO_PREVIOUS_CASETTE_PAGE';
export const CASETTE_ACTIONS_RECEIVE = 'VCR_PLAYER/CASETTE_ACTIONS_RECEIVE';
export const TOGGLE_PLAY_PAUSE = 'VCR_PLAYER/TOGGLE_PLAY_PAUSE';
export const INCREMENT_ACTIONS_PLAYED = 'VCR_PLAYER/INCREMENT_ACTIONS_PLAYED';
export const CHANGE_PLAYBACK_SPEED = 'VCR_PLAYER/CHANGE_PLAYBACK_SPEED';


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const casettesListRequest = () => ({
  type: CASETTES_LIST_REQUEST,
});

export const casettesListReceive = ({ casettes }) => ({
  type: CASETTES_LIST_RECEIVE,
  casettes,
});

export const viewCasettes = () => ({
  type: VIEW_CASETTES,
});

export const hideCasettes = () => ({
  type: HIDE_CASETTES,
});

export const selectCasette = ({ id }) => ({
  type: SELECT_CASETTE,
  id,
});

export const ejectCasette = () => ({
  type: EJECT_CASETTE,
});

export const playCasette = () => ({
  type: PLAY_CASETTE,
});

export const pauseCasette = () => ({
  type: PAUSE_CASETTE,
});

export const stopCasette = () => ({
  type: STOP_CASETTE,
});

// This is a special action, used by our higher-order reducer to wipe the state.
// It ensures that when a tape is played, it plays in the right context.
export const rewindCasetteAndRestoreApp = () => ({
  type: REWIND_CASETTE_AND_RESTORE_APP,
});

export const goToNextCasettePage = () => ({
  type: GO_TO_NEXT_CASETTE_PAGE,
});

export const goToPreviousCasettePage = () => ({
  type: GO_TO_PREVIOUS_CASETTE_PAGE,
});

export const casetteActionsReceive = ({ id, casetteActions }) => ({
  type: CASETTE_ACTIONS_RECEIVE,
  id,
  casetteActions,
});

export const incrementActionsPlayed = () => ({
  type: INCREMENT_ACTIONS_PLAYED,
});

export const changePlaybackSpeed = playbackSpeed => ({
  type: CHANGE_PLAYBACK_SPEED,
  playbackSpeed,
});
