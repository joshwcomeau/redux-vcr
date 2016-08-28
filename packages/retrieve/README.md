# Redux VCR / retrieve

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Retrieve handles fetching the cassettes so that they are available to /replay. It also handles authentication, to ensure that only the admin of the application can watch user sessions.

Its responsibilities include:

- Connecting to Firebase
- Fetching a list of cassettes, likely on pageload
- Fetching the actions for a specific cassette, when it's selected.
- Handling developer authentication, with GitHub (more providers can be added if requested)

--------

### How It Works

TODO
