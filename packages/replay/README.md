# ReduxVCR.replay

[![build status](https://travis-ci.org/joshwcomeau/redux-vcr.svg?branch=master)](https://travis-ci.org/joshwcomeau/redux-vcr)
[![npm version](https://img.shields.io/npm/v/redux-vcr.replay.svg)](https://www.npmjs.com/package/redux-vcr.replay)
[![npm monthly downloads](https://img.shields.io/npm/dm/redux-vcr.replay.svg)](https://www.npmjs.com/package/redux-vcr.replay)

ReduxVCR.replay is responsible for letting you, the admin, replay the actions of your users.

Its responsibilities include:

- Providing a cute little VCR interface for controlling the replays.
- Letting you pick from a list of recent sessions (known as 'cassettes')
- Hooking into your Redux state, to be able to reset it when new cassettes are loaded, prepare their initial state, etc.

--------

## More Info

This package belongs to the [ReduxVCR monolithic repo](https://github.com/joshwcomeau/redux-vcr). You'll find full information about this and other core modules there.

You can also jump straight to the [ReduxVCR.replay API reference](https://github.com/joshwcomeau/redux-vcr/blob/master/documentation/API-reference.md#replay).
