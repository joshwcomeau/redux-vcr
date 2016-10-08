/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';


import { createCaptureMiddleware } from 'redux-vcr.capture';
import { createPersistHandler } from 'redux-vcr.persist';
import {
  getQueryParam,
  createRetrieveHandler,
  createRetrieveMiddleware,
} from 'redux-vcr.retrieve';
import {
  createReplayMiddleware,
  wrapReducer,
} from 'redux-vcr.replay';


import { COMPLETE_ONBOARDING } from './actions';
import DevTools from './components/DevTools';
import App from './components/App';
import reducer from './reducers';

const settings = {
  runAsUser: true,
  runAsAdmin: true,
};


// Firebase credentials are safe to distribute in the client;
// on their own, they don't grant any authorization.
// It's for this reason that Firebase was chosen, so that no server-side
// authentication is required :)
const firebaseAuth = {
  apiKey: 'AIzaSyDPq76JUdNtZcnileNl0fRpVtwGD4zgpjY',
  authDomain: 'redux-vcr-demo.firebaseapp.com',
  databaseURL: 'https://redux-vcr-demo.firebaseio.com',
};

const middlewares = [];

if (settings.runAsUser) {
  // The PersistHandler handles submitting captured actions to Firebase.
  // The only required config is the firebaseAuth object.
  // This should be distributed to your users in production.

  middlewares.push(
    // The capture middleware chronicles, filters, and timestamps actions
    // as they're dispatched to the store. It needs to be passed the
    // PersistHandler so it can send them to Firebase.
    createCaptureMiddleware({
      persistHandler: createPersistHandler({ firebaseAuth }),
      startTrigger: COMPLETE_ONBOARDING,
    }),
  );
}

if (settings.runAsAdmin) {
  // Inversely, the createRetrieveHandler pulls actions from Firebase, allowing
  // them to be replayed. It should only be included in development.
  middlewares.push(
    // The retrieve middleware listens for specific actions dispatched
    // from the Replay components, to fetch the recordings needed.
    createRetrieveMiddleware({
      retrieveHandler: createRetrieveHandler({ firebaseAuth }),
      initialCassetteId: getQueryParam({ param: 'cassetteId' }),
    }),

    // Finally, the replay middleware is in charge of intercepting the
    // PLAY_CASSETTE action, which allows previously-recorded sessions
    // to be replayed.
    createReplayMiddleware({ maximumDelay: 500 }),
  );
}


const store = createStore(
  // This higher-order reducer exists purely to tackle resetting the state
  // before a cassette is played. It ensures recordings will run smoothly.
  wrapReducer(reducer),
  compose(
    applyMiddleware.apply(this, middlewares),
    DevTools.instrument()
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
