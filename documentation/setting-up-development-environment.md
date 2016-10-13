# Setting up the Development Environment

### About ReduxVCR's setup
Redux VCR is a [monolithic repo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) that holds 7 different NPM packages:
* Capture
* Persist
* Retrieve
* Replay
* Shared (a shared dependency which holds Firebase logic as well as redux actions/reducers)
* Root (this is just a wrapper that bundles the above so that it can be published as a single package)
* Demo (this is just used for local development)

Their version numbers are all tied; a change to a single package will increment the suite's version. This is to avoid confusion of knowing which versions are compatible with which versions.


### Linking the packages
Maintaining a quick, iterative development flow is important, but it's surprisingly tricky when dealing with multiple independent packages.

The best solution I've found so far is [Lerna](https://lernajs.io/).

We tweak Lerna's default slightly by directly linking the /src files (as opposed to the built /lib files). This means that all you have to do is save a file in one of the sibling repos and the demo should update automatically.

### Getting set up

Once you've forked and cloned the repo, run:

```bash
npm run install
```

That isn't a typo: You want to run the NPM script `install`, not the  traditional `npm install`.

This will install all the dependencies for the children packages.

Once it installs, run:

```bash
npm run bootstrap
```

This links all the repos together, allowing for the aforementioned development environment.

Finally, to start working, run:

```bash
npm run demo
```

This will launch the very simple demo app, which allows you to see and test the changes you make.


### Tests

Tests are an important part of ReduxVCR. Please add tests for any new code that you add.

While not required, I've found TDD to be effective when developing new features for ReduxVCR.

To run the tests, you can run any of the following commands from the root directory:

```bash
npm run test:capture
npm run test:persist
npm run test:retrieve
npm run test:replay
npm run test:shared

npm run test
```

That last command will run the whole suite of tests.

By `cd`ing into an individual package's repo, you can also run a test watcher:

```bash
npm run test:watch
```
