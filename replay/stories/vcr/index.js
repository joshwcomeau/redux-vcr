/* eslint-disable semi, no-unused-vars */
import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Centered from '../Centered';
import { VCR } from '../../src/components/VCR';

storiesOf('VCR', module)
  .addDecorator(story => (
    <div className="redux-vcr-component at-bottom">
      {story()}
    </div>
  ))
  .add('default (stopped, idle, unauthenticated)', () => (
    <VCR
      playStatus="stopped"
      cassetteStatus="idle"
      selectedCassette={null}
      playbackSpeed={1}
      loggedIn={false}
      playCassette={action('Play cassette')}
      pauseCassette={action('Pause cassette')}
      stopCassette={action('Stop cassette')}
      viewCassettes={action('View cassettes')}
      ejectCassette={action('Eject cassette')}
      changePlaybackSpeed={action('Change playback speed')}
    />
  ))
  .add('authenticated', () => (
    <VCR
      playStatus="stopped"
      cassetteStatus="idle"
      selectedCassette={null}
      playbackSpeed={1}
      loggedIn
      playCassette={action('Play cassette')}
      pauseCassette={action('Pause cassette')}
      stopCassette={action('Stop cassette')}
      viewCassettes={action('View cassettes')}
      ejectCassette={action('Eject cassette')}
      changePlaybackSpeed={action('Change playback speed')}
    />
  ))
