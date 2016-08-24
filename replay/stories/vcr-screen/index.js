/* eslint-disable semi, no-unused-vars */
import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Centered from '../Centered';
import { VCRScreen } from '../../src/components/VCRScreen';

storiesOf('VCRScreen', module)
  .addDecorator(story => (
    <div className="redux-vcr-component at-bottom">
      {story()}
    </div>
  ))
  .add('Default', () => (
    <VCRScreen>
      Welcome to Redux VCR
    </VCRScreen>
  ))
  .add('Waiting for authentication', () => (
    <VCRScreen
      textColor="green"
      effects={['scrolling', 'centered']}
    >
      Please authenticate.
    </VCRScreen>
  ))
  .add('Displaying error', () => (
    <VCRScreen
      textColor="red"
      effects={['flashing']}
    >
      Please authenticate.
    </VCRScreen>
  ))
  .add('With label', () => (
    <VCRScreen
      label="Loaded"
    >
      Cassette #1234
    </VCRScreen>
  ))
