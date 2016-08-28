# Redux VCR / persist

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Persist receives a Cassette object from `capture`, and is responsible for syncing it with some external database.

Its responsibilities include:

- Debouncing updates from `capture`
- Authenticating with the external service for write access (if required)
- Sending cassette data to the server

--------

### How It Works

This base Persist layer uses Firebase for simplicity.

It needs to be initialized with valid Firebase credentials. The initialize
method will also sign the user in anonymously, generating a user_id. This
user will then only be able to write to their own cassette.
