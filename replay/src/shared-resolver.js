// DO NOT TOUCH THIS FILE.
// This is a (hopefully temporary) way of dealing with the fact that these
// modules share a common dependency - the /shared directory, and it's a
// pain to need to build and publish a new version whenever we want to make
// changes.
//
// The publish script (/scripts/publish-all.js) will update this file before
// and after it does its work, so that we have the convenience of a relative
// import in development, but NPM exports a working module.
//
// It's wrapped in a try/catch because `require` is special and won't obey
// the ternary. It will still try and require the local path in production,
// or remote development, and we want to ignore those failures and just import
// the NPM module.
//
/* eslint-disable global-require, import/no-mutable-exports */

const useLocal = true;

let sharedContents;
try {
  sharedContents = useLocal
    ? require('../../shared/src')
    : require('redux-vcr.shared');

  console.log('Use local?', useLocal);
} catch (e) {
  console.log('Caught', e);
  sharedContents = require('redux-vcr.shared');
}

module.exports = sharedContents;
