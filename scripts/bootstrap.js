const fs = require('fs');
const { exec } = require('shelljs');

// Lerna does a pretty good job of bootstrapping the project;
// The only flaw is it points at the compiled (/lib) code, and I want it to
// point at the /src.

// TODO: add cmd-line fallback to lerna if we want to test the /lib

exec('lerna bootstrap');

const packageIndices = [
  './packages/_demo/node_modules/redux-vcr.capture/index.js',
  './packages/_demo/node_modules/redux-vcr.persist/index.js',
  './packages/_demo/node_modules/redux-vcr.retrieve/index.js',
  './packages/_demo/node_modules/redux-vcr.replay/index.js',

  './packages/_root/node_modules/redux-vcr.capture/index.js',
  './packages/_root/node_modules/redux-vcr.persist/index.js',
  './packages/_root/node_modules/redux-vcr.retrieve/index.js',
  './packages/_root/node_modules/redux-vcr.replay/index.js',

  './packages/capture/node_modules/redux-vcr.shared/index.js',
  './packages/persist/node_modules/redux-vcr.shared/index.js',
  './packages/replay/node_modules/redux-vcr.shared/index.js',
  './packages/retrieve/node_modules/redux-vcr.shared/index.js',
];

packageIndices.forEach(indexPath => {
  const indexContents = fs.readFileSync(indexPath, 'utf8');

  const updatedContents = (
    indexContents.slice(0, -4) +
    '/src' +
    indexContents.slice(-4)
  );

  console.info('Updating index contents to', updatedContents);

  fs.writeFileSync(indexPath, updatedContents);
});

// TODO: Handle shared React dependency.
// To prevent multiple copies from loading, we want to point both /demo
// and /shared to the parent dependency.
