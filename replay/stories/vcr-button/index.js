/* eslint-disable semi, no-unused-vars */
import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Centered from '../Centered';
import VCRButton from '../../src/components/VCRButton';

storiesOf('VCRButton', module)
  .add('Play', () => (
    <div className="redux-vcr-component">
      <Centered>
        <VCRButton iconValue="play" iconSize={48} />
      </Centered>
    </div>
  ))

  .add('Toggleable Play/Pause', () => {
    class Toggleable extends Component {
      constructor(props) {
        super(props);
        this.state = {
          toggled: false,
        };
      }
      render() {
        return (
          <VCRButton
            iconValue={this.state.toggled ? 'play' : 'pause'}
            onClick={() => {
              this.setState({ toggled: !this.state.toggled })
            }}
            iconSize={48}
          />
        );
      }
    }

    return (
      <div className="redux-vcr-component">
        <Centered>
          <Toggleable />
        </Centered>
      </div>
    );
  })

  .add('Glowing', () => (
    <div className="redux-vcr-component">
      <Centered>
        <VCRButton iconValue="stop" iconSize={48} glowing />
      </Centered>
    </div>
  ))
