/* eslint-disable semi, no-unused-vars */
import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Centered from '../Centered';
import { Cassette } from '../../src/components/Cassette';

storiesOf('Cassette', module)
  .addDecorator(story => (
    <div className="redux-vcr-component">
      <Centered>
        {story()}
      </Centered>
    </div>
  ))
  .add('Default (without name)', () => (
    <Cassette
      id="abcd1234"
      theme="generic"
      timestamp={+Date.now()}
      numOfActions={20}
    />
  ))
  .add('With name', () => (
    <Cassette
      id="abcd1234"
      label="Josh's fancy cassette"
      theme="generic"
      timestamp={+Date.now()}
      numOfActions={20}
    />
  ))
  .add('Theme: polaroid', () => (
    <Cassette
      id="abcd1234"
      label="Josh's fancy cassette"
      theme="polaroid"
      timestamp={+Date.now()}
      numOfActions={20}
    />
  ))
  .add('Theme: Kodak', () => (
    <Cassette
      id="abcd1234"
      label="Josh's fancy cassette"
      theme="kodak"
      timestamp={+Date.now()}
      numOfActions={20}
    />
  ))
  .add('Theme: tdk', () => (
    <Cassette
      id="abcd1234"
      label="Josh's fancy cassette"
      theme="tdk"
      timestamp={+Date.now()}
      numOfActions={20}
    />
  ))
