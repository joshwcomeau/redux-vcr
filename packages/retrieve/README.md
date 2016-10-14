# ReduxVCR.retrieve

[![build status](https://travis-ci.org/joshwcomeau/redux-vcr.svg?branch=master)](https://travis-ci.org/joshwcomeau/redux-vcr)
[![npm version](https://img.shields.io/npm/v/redux-vcr.retrieve.svg)](https://www.npmjs.com/package/redux-vcr.retrieve)
[![npm monthly downloads](https://img.shields.io/npm/dm/redux-vcr.retrieve.svg)](https://www.npmjs.com/package/redux-vcr.retrieve)

ReduxVCR.retrieve handles fetching the cassettes so that they are available to ReduxVCR.replay. It also handles authentication, to ensure that only the admin of the application can watch user sessions.

Its responsibilities include:

- Connecting to Firebase
- Fetching a list of cassettes
- Fetching the actions for a specific cassette, when it's selected
- Handling developer authentication, with GitHub

--------

## More Info

This package belongs to the [ReduxVCR monolithic repo](https://github.com/joshwcomeau/redux-vcr). You'll find full information about this and other core modules there.

You can also jump straight to the [ReduxVCR.replay API reference](https://github.com/joshwcomeau/redux-vcr/blob/master/documentation/API-reference.md#replay).
