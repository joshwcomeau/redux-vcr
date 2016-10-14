# ReduxVCR.persist

[![build status](https://travis-ci.org/joshwcomeau/redux-vcr.svg?branch=master)](https://travis-ci.org/joshwcomeau/redux-vcr)
[![npm version](https://img.shields.io/npm/v/redux-vcr.persist.svg)](https://www.npmjs.com/package/redux-vcr.persist)
[![npm monthly downloads](https://img.shields.io/npm/dm/redux-vcr.persist.svg)](https://www.npmjs.com/package/redux-vcr.persist)

ReduxVCR.persist exposes a handler that receives a Cassette object from ReduxVCR.capture, and is responsible for syncing it with Firebase.

This module includes a middleware that :

- Debouncing updates from ReduxVCR.capture
- Anonymously authenticating with Firebase for write access
- Persisting cassette data to Firebase.

## More Info

This package belongs to the [ReduxVCR monolithic repo](https://github.com/joshwcomeau/redux-vcr). You'll find full information about this and other core modules there.

You can also jump straight to the [ReduxVCR.persist API reference](https://github.com/joshwcomeau/redux-vcr/blob/master/documentation/API-reference.md#persist).
