/* eslint-disable no-param-reassign */
const path = require('path');
const fs = require('fs');
const { compose } = require('redux');
const _ = require('lodash');
const semver = require('semver');
const { exec } = require('shelljs');

const versionType = process.argv[2] || 'patch';
const acceptedVersionTypes = ['major', 'minor', 'patch'];

if (!acceptedVersionTypes.includes(versionType)) {
  throw new Error(`
    Unacceptable version type requested.
    Must be one of: 'major', 'minor', 'patch'.
    You provided '${versionType}'.
  `);
}

// To publish a new suite, a few things need to happen:
// - figure out what the current version is, and increment it
// - publish redux-vcr.shared at the new version.
// - update the /shared dependency for the 4 other packages, and then publish their new version.


const getPathForPackageJson = moduleName => path.join(
  __dirname, `../${moduleName}/package.json`
);

const parseAndRead = compose(
  JSON.parse,
  fs.readFileSync
);

const writePackageJson = (moduleName, newPackageContents) => {
  fs.writeFileSync(
    getPathForPackageJson(moduleName),
    JSON.stringify(newPackageContents, null, '  ')
  );
};

const readPackageJson = compose(parseAndRead, getPathForPackageJson);

const capturePackage = readPackageJson('capture');
const persistPackage = readPackageJson('persist');
const retrievePackage = readPackageJson('retrieve');
const replayPackage = readPackageJson('replay');
const sharedPackage = readPackageJson('shared');

const packages = [
  capturePackage,
  persistPackage,
  retrievePackage,
  replayPackage,
  sharedPackage,
];

console.info(`
  =======================
  Starting publish.
  =======================

`);

// Step 1: Figure out what the next version should be.
// Take the highest version from all current packages
const highestPackage = _.maxBy(packages, _.property('version'));
const currentVersion = highestPackage.version;
const nextVersion = semver.inc(currentVersion, versionType);

console.info(`
  =======================
  Current package versions: ${packages.map(p => p.version)}.
  Highest is ${currentVersion}.
  About to publish ${nextVersion}.
  =======================

`);

// Step 2: Increment shared to this new version, and publish.
// Start by writing the package.json.
sharedPackage.version = nextVersion;
writePackageJson('shared', sharedPackage);


// Step 3: Build and publish new `shared` version
exec('npm run publish:shared');

console.info(`
  =======================
  'shared' module published!
  =======================

`);


// Step 4: Update the 'shared' dependency / increment the version
// number for all other packages.
const mainPackages = {
  capture: capturePackage,
  persist: persistPackage,
  retrieve: retrievePackage,
  replay: replayPackage,
};

_.forEach(mainPackages, (packageContents, moduleName) => {
  packageContents.version = nextVersion;
  packageContents.dependencies['redux-vcr.shared'] = nextVersion;
  writePackageJson(moduleName, packageContents);
});


// Step 5 (final)
// Publish all modules! :)
exec('npm run publish:all');


// TODO: publish the 'parent' module that allows for a single-import.

console.info(`
  =======================
  Successfully published!
  New current version is v${nextVersion}, a ${versionType} increment from v${currentVersion}.
  =======================

`);
