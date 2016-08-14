export const CASSETTES_LIST_REQUEST = 'REDUX_VCR/CASSETTES_LIST_REQUEST';
export const CASSETTES_LIST_RECEIVE = 'REDUX_VCR/CASSETTES_LIST_RECEIVE';
export const CASSETTES_LIST_FAILURE = 'REDUX_VCR/CASSETTES_LIST_FAILURE';
export const VIEW_CASSETTES = 'REDUX_VCR/VIEW_CASSETTES';
export const HIDE_CASSETTES = 'REDUX_VCR/HIDE_CASSETTES';
export const SELECT_CASSETTE = 'REDUX_VCR/SELECT_CASSETTE';
export const EJECT_CASSETTE = 'REDUX_VCR/EJECT_CASSETTE';
export const PLAY_CASSETTE = 'REDUX_VCR/PLAY_CASSETTE';
export const PAUSE_CASSETTE = 'REDUX_VCR/PAUSE_CASSETTE';
export const STOP_CASSETTE = 'REDUX_VCR/STOP_CASSETTE';
export const REWIND_CASSETTE_AND_RESTORE_APP = 'REDUX_VCR/REWIND_CASSETTE_AND_RESTORE_APP';
export const GO_TO_NEXT_CASSETTE_PAGE = 'REDUX_VCR/GO_TO_NEXT_CASSETTE_PAGE';
export const GO_TO_PREVIOUS_CASSETTE_PAGE = 'REDUX_VCR/GO_TO_PREVIOUS_CASSETTE_PAGE';
export const CASSETTE_ACTIONS_RECEIVE = 'REDUX_VCR/CASSETTE_ACTIONS_RECEIVE';
export const TOGGLE_PLAY_PAUSE = 'REDUX_VCR/TOGGLE_PLAY_PAUSE';
export const INCREMENT_ACTIONS_PLAYED = 'REDUX_VCR/INCREMENT_ACTIONS_PLAYED';
export const CHANGE_PLAYBACK_SPEED = 'REDUX_VCR/CHANGE_PLAYBACK_SPEED';


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const cassettesListRequest = () => ({
  type: CASSETTES_LIST_REQUEST,
});

export const cassettesListReceive = ({ cassettes }) => ({
  type: CASSETTES_LIST_RECEIVE,
  cassettes,
});

export const viewCasettes = () => ({
  type: VIEW_CASSETTES,
});

export const hideCasettes = () => ({
  type: HIDE_CASSETTES,
});

export const selectCasette = ({ id }) => ({
  type: SELECT_CASSETTE,
  id,
});

export const ejectCasette = () => ({
  type: EJECT_CASSETTE,
});

export const playCasette = () => ({
  type: PLAY_CASSETTE,
});

export const pauseCasette = () => ({
  type: PAUSE_CASSETTE,
});

export const stopCasette = () => ({
  type: STOP_CASSETTE,
});

// This is a special action, used by our higher-order reducer to wipe the state.
// It ensures that when a tape is played, it plays in the right context.
export const rewindCasetteAndRestoreApp = () => ({
  type: REWIND_CASSETTE_AND_RESTORE_APP,
});

export const goToNextCasettePage = () => ({
  type: GO_TO_NEXT_CASSETTE_PAGE,
});

export const goToPreviousCasettePage = () => ({
  type: GO_TO_PREVIOUS_CASSETTE_PAGE,
});

export const cassetteActionsReceive = ({ id, cassetteActions }) => ({
  type: CASSETTE_ACTIONS_RECEIVE,
  id,
  cassetteActions,
});

export const incrementActionsPlayed = () => ({
  type: INCREMENT_ACTIONS_PLAYED,
});

export const changePlaybackSpeed = playbackSpeed => ({
  type: CHANGE_PLAYBACK_SPEED,
  playbackSpeed,
});
