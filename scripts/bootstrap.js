const fs = require('fs');
const { exec } = require('shelljs');

// Lerna does a pretty good job of bootstrapping the project;
// The only flaw is it points at the compiled (/lib) code, and I want it to
// point at the /src.
// We also need to bootstrap React, so that it doesn't try to load multiple
// copies in development.

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

  // If we've already updated it to point at /src, do nothing!
  if (indexContents.match(/\/src/)) {
    return;
  }

  const updatedContents = (
    indexContents.slice(0, -4) +
    '/src' +
    indexContents.slice(-4)
  );

  console.info('Updating index contents to', updatedContents);

  fs.writeFileSync(indexPath, updatedContents);
});

// To prevent multiple copies of React from loading in dev,
// we want to point both /demo and /replay to the parent dependency.
const reactPaths = [
  './packages/_demo/node_modules/react',
  './packages/replay/node_modules/react',
];

reactPaths.forEach(reactPath => {
  // Start by deleting the directory, replacing it with an empty one.
  exec(`rm -rf ${reactPath}`);
  exec(`mkdir ${reactPath}`);

  console.info(`Updating React path at ${reactPath}`);

  // TODO: Fetch React version number from parent package.json
  const REACT_VERSION = '15.3.0';

  const packageJson = `{
    "name": "react",
    "version": "${REACT_VERSION}"
  }`;

  const indexJs = "module.exports = require('../../../../node_modules/react');";

  exec(`echo '${packageJson}' >> ${reactPath}/package.json`);
  exec(`echo "${indexJs}" >> ${reactPath}/index.js`);
});

console.info("Done! You've been bootstrapped.");
