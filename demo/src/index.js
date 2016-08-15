/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { captureMiddleware } from '../../capture/src';
import { PersistHandler } from '../../persist/src';
import { RetrieveHandler, retrieveMiddleware } from '../../retrieve/src';
import { replayMiddleware, wrapReducer } from '../../replay/src';

import App from './components/App';
import reducer from './reducers';


// Firebase credentials are safe to distribute in the client;
// on their own, they don't grant any authorization.
// It's for this reason that Firebase was chosen, so that no server-side
// authentication is required :)
const firebaseAuth = {
  apiKey: 'AIzaSyDPq76JUdNtZcnileNl0fRpVtwGD4zgpjY',
  authDomain: 'redux-vcr-demo.firebaseapp.com',
  databaseURL: 'https://redux-vcr-demo.firebaseio.com',
};

// The PersistHandler handles submitting captured actions to Firebase.
// The only required config is the firebaseAuth object.
// This should be distributed to your users in production.
const persister = new PersistHandler({ firebaseAuth });

// Inversely, the RetrieveHandler pulls actions from Firebase, allowing
// them to be replayed. It should only be included in development.
const retriever = new RetrieveHandler({ firebaseAuth });

const middlewares = [
  // The capture middleware chronicles, filters, and timestamps actions
  // as they're dispatched to the store. It needs to be passed the
  // PersistHandler so it can send them to Firebase.
  captureMiddleware({ dataHandler: persister }),

  // The retrieve middleware listens for specific actions dispatched
  // from the Replay components, to fetch the recordings needed.
  retrieveMiddleware({ dataHandler: retriever }),

  // Finally, the replay middleware is in charge of intercepting the
  // PLAY_CASSETTE action, which allows previously-recorded sessions
  // to be replayed.
  replayMiddleware,
];

const store = createStore(
  // This higher-order reducer exists purely to tackle resetting the state
  // before a cassette is played. It ensures recordings will run smoothly.
  wrapReducer(reducer),
  applyMiddleware.apply(this, middlewares)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
