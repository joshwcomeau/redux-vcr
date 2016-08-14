# Redux VCR / replay

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Replay is responsible for letting you, the admin, replay the actions of your users.

Its responsibilities include:

- Providing a cute little React VCR for controlling the replays
- Letting you start, stop, pause, and change the speed of replaying a given user's session
- Letting you pick from a list of recent sessions (known as 'cassettes')

--------

### How It Works

There are a few pieces to this module:

- We have a collection of React components for control
- Those react components connect to the redux store, and dispatch actions to affect the replays.
- The store holds the data collected and retrieved by the other ReduxVCR modules
- A middleware watches for PLAY_CASSETTE, and uses a utility to recursively trigger actions as long as playStatus holds true.
