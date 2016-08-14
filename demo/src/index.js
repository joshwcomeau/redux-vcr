/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import captureMiddleware from '../../capture/lib';
import PersistHandler from '../../persist/lib';
import RetrieveHandler from '../../retrieve/lib/retrieve-data-handler';
import retrieveMiddleware from '../../retrieve/lib';

import App from './components/App';
import reducer from './reducers';
import './index.css';

const firebaseAuth = {
  apiKey: 'AIzaSyDPq76JUdNtZcnileNl0fRpVtwGD4zgpjY',
  authDomain: 'redux-vcr-demo.firebaseapp.com',
  databaseURL: 'https://redux-vcr-demo.firebaseio.com',
};

const persister = new PersistHandler({ firebaseAuth });
const retriever = new RetrieveHandler({ firebaseAuth });

const middlewares = [
  captureMiddleware({ dataHandler: persister }),
  retrieveMiddleware({ dataHandler: retriever }),
];

const store = createStore(
  reducer,
  applyMiddleware.apply(this, middlewares)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
