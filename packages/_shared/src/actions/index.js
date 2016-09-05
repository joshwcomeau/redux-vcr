export const CASSETTES_LIST_REQUEST = 'REDUX_VCR/CASSETTES_LIST_REQUEST';
export const CASSETTES_LIST_SUCCESS = 'REDUX_VCR/CASSETTES_LIST_SUCCESS';
export const CASSETTES_LIST_FAILURE = 'REDUX_VCR/CASSETTES_LIST_FAILURE';
export const VIEW_CASSETTES = 'REDUX_VCR/VIEW_CASSETTES';
export const HIDE_CASSETTES = 'REDUX_VCR/HIDE_CASSETTES';
export const SELECT_CASSETTE = 'REDUX_VCR/SELECT_CASSETTE';
export const EJECT_CASSETTE = 'REDUX_VCR/EJECT_CASSETTE';
export const PLAY_CASSETTE = 'REDUX_VCR/PLAY_CASSETTE';
export const PAUSE_CASSETTE = 'REDUX_VCR/PAUSE_CASSETTE';
export const STOP_CASSETTE = 'REDUX_VCR/STOP_CASSETTE';
export const REWIND_CASSETTE_AND_RESTORE_APP = 'REDUX_VCR/REWIND_CASSETTE_AND_RESTORE_APP';
export const UPDATE_CASSETTE_INITIAL_STATE = 'REDUX_VCR/UPDATE_CASSETTE_INITIAL_STATE';
export const GO_TO_NEXT_CASSETTE_PAGE = 'REDUX_VCR/GO_TO_NEXT_CASSETTE_PAGE';
export const GO_TO_PREVIOUS_CASSETTE_PAGE = 'REDUX_VCR/GO_TO_PREVIOUS_CASSETTE_PAGE';
export const CASSETTE_ACTIONS_RECEIVE = 'REDUX_VCR/CASSETTE_ACTIONS_RECEIVE';
export const TOGGLE_PLAY_PAUSE = 'REDUX_VCR/TOGGLE_PLAY_PAUSE';
export const INCREMENT_ACTIONS_PLAYED = 'REDUX_VCR/INCREMENT_ACTIONS_PLAYED';
export const CHANGE_PLAYBACK_SPEED = 'REDUX_VCR/CHANGE_PLAYBACK_SPEED';
export const CHANGE_MAXIMUM_DELAY = 'REDUX_VCR/CHANGE_MAXIMUM_DELAY';
export const SIGN_IN_REQUEST = 'REDUX_VCR/SIGN_IN_REQUEST';
export const SIGN_IN_SUCCESS = 'REDUX_VCR/SIGN_IN_SUCCESS';
export const SIGN_IN_FAILURE = 'REDUX_VCR/SIGN_IN_FAILURE';
export const SIGN_OUT_REQUEST = 'REDUX_VCR/SIGN_OUT_REQUEST';
export const SIGN_OUT_SUCCESS = 'REDUX_VCR/SIGN_OUT_SUCCESS';
export const SIGN_OUT_FAILURE = 'REDUX_VCR/SIGN_OUT_FAILURE';
export const SET_AUTH_REQUIREMENT = 'REDUX_VCR/SET_AUTH_REQUIREMENT';

// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const cassettesListRequest = () => ({
  type: CASSETTES_LIST_REQUEST,
});

export const cassettesListSuccess = ({ cassettes }) => ({
  type: CASSETTES_LIST_SUCCESS,
  cassettes,
});

export const cassettesListFailure = ({ error }) => ({
  type: CASSETTES_LIST_FAILURE,
  error,
});

export const viewCassettes = () => ({
  type: VIEW_CASSETTES,
});

export const hideCassettes = () => ({
  type: HIDE_CASSETTES,
});

export const selectCassette = ({ id }) => ({
  type: SELECT_CASSETTE,
  id,
});

export const ejectCassette = () => ({
  type: EJECT_CASSETTE,
});

export const playCassette = () => ({
  type: PLAY_CASSETTE,
});

export const pauseCassette = () => ({
  type: PAUSE_CASSETTE,
});

export const stopCassette = () => ({
  type: STOP_CASSETTE,
});

// This is a special action, used by our higher-order reducer to wipe the state.
// It ensures that when a tape is played, it plays in the right context.
export const rewindCassetteAndRestoreApp = () => ({
  type: REWIND_CASSETTE_AND_RESTORE_APP,
});

export const updateCassetteInitialState = ({ selected, newState }) => ({
  type: UPDATE_CASSETTE_INITIAL_STATE,
  selected,
  newState,
});

export const goToNextCassettePage = () => ({
  type: GO_TO_NEXT_CASSETTE_PAGE,
});

export const goToPreviousCassettePage = () => ({
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

export const changePlaybackSpeed = ({ playbackSpeed }) => ({
  type: CHANGE_PLAYBACK_SPEED,
  playbackSpeed,
});

export const changeMaximumDelay = ({ maximumDelay }) => ({
  type: CHANGE_MAXIMUM_DELAY,
  maximumDelay,
});

export const signInRequest = ({ authMethod }) => ({
  type: SIGN_IN_REQUEST,
  authMethod,
});

export const signInSuccess = ({ user, credential }) => ({
  type: SIGN_IN_SUCCESS,
  user,
  credential,
});

export const signInFailure = ({ error }) => ({
  type: SIGN_IN_FAILURE,
  error,
});

export const signOutRequest = () => ({
  type: SIGN_OUT_REQUEST,
});

export const signOutSuccess = () => ({
  type: SIGN_OUT_SUCCESS,
});

export const signOutFailure = () => ({
  type: SIGN_OUT_FAILURE,
});

export const setAuthRequirement = ({ requiresAuth }) => ({
  type: SET_AUTH_REQUIREMENT,
  requiresAuth,
});
