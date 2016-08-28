/* eslint-disable semi, no-unused-vars */
import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { storiesOf, action } from '@kadira/storybook';

import Centered from '../Centered';
import { VCR } from '../../src/components/VCR';

const dummyReducer = (state = {}, action) => {
  return state;
};

const store = createStore(dummyReducer);

storiesOf('VCR', module)
  .addDecorator(story => (
    <Provider store={store}>
      <div className="redux-vcr-component at-bottom">
        {story()}
      </div>
    </Provider>
  ))
  .add('Default (stopped, idle, unauthenticated)', () => (
    <VCR
      playStatus="stopped"
      cassetteStatus="idle"
      selectedCassette={null}
      playbackSpeed={1}
      isLoggedIn={false}
      hasAuthError={false}
      playCassette={action('Play cassette')}
      pauseCassette={action('Pause cassette')}
      stopCassette={action('Stop cassette')}
      viewCassettes={action('View cassettes')}
      ejectCassette={action('Eject cassette')}
      changePlaybackSpeed={action('Change playback speed')}
      signInRequest={action('Sign-in request')}
    />
  ))
  .add('Authenticated', () => (
    <VCR
      playStatus="stopped"
      cassetteStatus="idle"
      selectedCassette={null}
      playbackSpeed={1}
      isLoggedIn
      hasAuthError={false}
      playCassette={action('Play cassette')}
      pauseCassette={action('Pause cassette')}
      stopCassette={action('Stop cassette')}
      viewCassettes={action('View cassettes')}
      ejectCassette={action('Eject cassette')}
      changePlaybackSpeed={action('Change playback speed')}
      signInRequest={action('Sign-in request')}
    />
  ))
  .add('Errored', () => (
    <VCR
      playStatus="stopped"
      cassetteStatus="idle"
      selectedCassette={null}
      playbackSpeed={1}
      isLoggedIn={false}
      hasAuthError
      playCassette={action('Play cassette')}
      pauseCassette={action('Pause cassette')}
      stopCassette={action('Stop cassette')}
      viewCassettes={action('View cassettes')}
      ejectCassette={action('Eject cassette')}
      changePlaybackSpeed={action('Change playback speed')}
      signInRequest={action('Sign-in request')}
    />
  ))

  .add('Loaded and stopped', () => (
    <VCR
      playStatus="stopped"
      cassetteStatus="loaded"
      selectedCassette="abc123"
      playbackSpeed={1}
      isLoggedIn
      hasAuthError={false}
      playCassette={action('Play cassette')}
      pauseCassette={action('Pause cassette')}
      stopCassette={action('Stop cassette')}
      viewCassettes={action('View cassettes')}
      ejectCassette={action('Eject cassette')}
      changePlaybackSpeed={action('Change playback speed')}
      signInRequest={action('Sign-in request')}
    />
  ))
