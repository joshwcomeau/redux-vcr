// Main reducer
import { reduxVCRReducer } from 'redux-vcr.shared';

// Components
import Backdrop from './components/Backdrop';
import Cassette from './components/Cassette';
import CassetteList from './components/CassetteList';
import Icon from './components/Icon';
import Replay from './components/Replay';
import VCR from './components/VCR';
import VCRButton from './components/VCRButton';
import VCRPowerLight from './components/VCRPowerLight';

// Core logic
import playHandler from './play-handler';
import createReplayMiddleware from './create-replay-middleware';
import wrapReducer from './wrap-reducer';


export {
  reduxVCRReducer,
  Backdrop,
  Cassette,
  CassetteList,
  Icon,
  Replay,
  VCR,
  VCRButton,
  VCRPowerLight,
  playHandler,
  createReplayMiddleware,
  wrapReducer,
};
