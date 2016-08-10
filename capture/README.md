# Redux VCR / capture

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Capture is responsible for collecting and preparing the Redux actions you'd like to persist. Its responsibilities include:

- Intercepting all actions dispatched to the Redux store
- Filtering out any actions that do not need to be captured
- Appending metadata to the actions (timestamps, user-identification, etc)
- Assigning a unique ID to each action

For sending the captured data to a database so that it can be replayed, See ReduxVCR/persist.

--------

### How It Works
