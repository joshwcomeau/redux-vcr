/* eslint-disable semi, no-unused-vars */
import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Provider } from 'react-redux';
import _ from 'lodash';

import Centered from '../Centered';
import CassetteList from '../../src/components/CassetteList';
import sampleWithProbability from '../../src/utils/sample-with-probability';
import themes from '../../src/data/cassette-themes';
import offsets from '../../src/data/cassette-offsets';


const cassettes = _.range(20).map(i => ({
  id: Math.random() * 1000 + '',
  timestamp: Date.now(),
  numOfActions: Math.floor(Math.random() * 100),
  theme: sampleWithProbability(themes, i),
  offset: sampleWithProbability(offsets),
}));

storiesOf('CassetteList', module)
  .addDecorator(story => (
    <div className="redux-vcr-component">
      <Centered>
        {story()}
      </Centered>
    </div>
  ))
  .add('Default', () => (
    <CassetteList
      cassettes={cassettes}
      isFirstPage
      cassettesListRequest={action('request cassettes list')}
      selectCassette={action('select cassette')}
      goToNextCassettePage={action('go to next cassette page')}
      goToPreviousCassettePage={action('go to prev cassette page')}
    />
  ))
