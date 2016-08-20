import React from 'react';
import { storiesOf } from '@kadira/storybook';
import VCRButton from '../../src/components/VCRButton';

storiesOf('VCRButton', module)
  .add('Play button', () => (
    <div className="redux-vcr-component">
      <VCRButton iconValue="play" />
    </div>
  ));
