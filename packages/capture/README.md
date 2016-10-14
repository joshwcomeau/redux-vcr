# ReduxVCR.capture

[![build status](https://travis-ci.org/joshwcomeau/redux-vcr.svg?branch=master)](https://travis-ci.org/joshwcomeau/redux-vcr)
[![npm version](https://img.shields.io/npm/v/redux-vcr.capture.svg)](https://www.npmjs.com/package/redux-vcr.capture)
[![npm monthly downloads](https://img.shields.io/npm/dm/redux-vcr.capture.svg)](https://www.npmjs.com/package/redux-vcr.capture)

ReduxVCR.capture is responsible for collecting and preparing the Redux actions you'd like to persist. Its responsibilities include:

- Intercepting all actions dispatched to the Redux store
- Filtering out any actions that do not need to be captured
- Appending time information to actions, so that they can be replayed in real-time.
- Creating the Cassette, an object that holds the sequence of actions as well as metadata (such as timestamp).


## More Info

This package belongs to the [ReduxVCR monolithic repo](https://github.com/joshwcomeau/redux-vcr). You'll find full information about this and other core modules there.

You can also jump straight to the [ReduxVCR.capture API reference](https://github.com/joshwcomeau/redux-vcr/blob/master/documentation/API-reference.md#capture).
