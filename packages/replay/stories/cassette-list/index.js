/* eslint-disable semi, no-unused-vars */
import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import _ from 'lodash';
import { reduxVCRReducer, actionCreators } from 'redux-vcr.shared';

import Centered from '../Centered';
import CassetteList from '../../src/components/CassetteList';
import sampleWithProbability from '../../src/utils/sample-with-probability';
import themes from '../../src/data/cassette-themes';
import offsets from '../../src/data/cassette-offsets';


const cassettesById = _.range(23)
  .map(i => ({
    id: Math.random() * 1000 + '',
    timestamp: Date.now(),
    numOfActions: Math.floor(Math.random() * 100),
    theme: sampleWithProbability(themes, i),
    offset: sampleWithProbability(offsets),
  }))
  .reduce((memo, cassette) => {
    // eslint-disable-next-line no-param-reassign
    memo[cassette.id] = cassette;
    return memo;
  }, {});

const reducer = combineReducers({ reduxVCR: reduxVCRReducer });
const store = createStore(reducer);

store.dispatch(actionCreators.cassettesListSuccess({
  cassettes: cassettesById,
}));

storiesOf('CassetteList', module)
  .addDecorator(story => (
    <Provider store={store}>
      <div className="redux-vcr-component">
        <Centered>
          {story()}
        </Centered>
      </div>
    </Provider>
  ))
  .add('Default', () => (
    <CassetteList
      cassettesListRequest={action('request cassettes list')}
      selectCassette={action('select cassette')}
      goToNextCassettePage={action('go to next cassette page')}
      goToPreviousCassettePage={action('go to prev cassette page')}
    />
  ))
