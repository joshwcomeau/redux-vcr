# Javascript Implementation

*Note: It is recommended you start with [Firebase configuration](firebase-config.md). This guide assumes you have your `config` object from Firebase ready to paste.*

ReduxVCR can be implemented a few different ways. This guide will go through a simple, "quickstart" version.

## Other Implementations

To help demonstrate various implementations, I've created a repo, Redux VCR TodoMVC. It has several pull requests open that showcase the diffs needed for different strategies:

- [Quickstart](https://github.com/joshwcomeau/redux-vcr-todomvc/pull/1)
- [Production-ready](https://github.com/joshwcomeau/redux-vcr-todomvc/pull/2)
- [Quickstart without authentication](https://github.com/joshwcomeau/redux-vcr-todomvc/pull/3)
- [Initial Cassette Pre-loaded](https://github.com/joshwcomeau/redux-vcr-todomvc/pull/4)
- More to come!

## Quickstart Implementation

#### Install
Start with a good, old-fashioned NPM install.

```bash
$ npm i -S redux-vcr
```

#### Integrate with Redux store
As per the [Firebase configuration instructions](firebase-config.md), you should have a `config` object ready, which will allow your application to connect with Firebase.

```js
var config = {
  apiKey: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  authDomain: "your-project-name.firebaseapp.com",
  databaseURL: "https://your-project-name.firebaseio.com",
  storageBucket: "your-project-name.appspot.com",
  messagingSenderId: "1234567890"
};
```

Let's modernize this a bit, and trim off the stuff we don't need:

```js
const firebaseAuth = {
  apiKey: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  authDomain: "your-project-name.firebaseapp.com",
  databaseURL: "https://your-project-name.firebaseio.com",
};
```

This next part will vary depending on your setup, but assuming a conventional 'configure-store.js' file, you'll want to add the following lines:

```js
// If you aren't already, be sure to import `applyMiddleware` from redux.
import { createStore, applyMiddleware } from 'redux';

import {
  createCaptureMiddleware,
  createPersistHandler,
  createRetrieveHandler,
  createRetrieveMiddleware,
  createReplayMiddleware,
  wrapReducer,
} from 'redux-vcr';

const firebaseAuth = {
  apiKey: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  authDomain: "your-project-name.firebaseapp.com",
  databaseURL: "https://your-project-name.firebaseio.com",
};

// The persist handler is what sends our data to Firebase
const persistHandler = createPersistHandler({ firebaseAuth });

// Similarly, the retrieve handler fetches those actions so that they can
// be replayed by you and your team
const retrieveHandler = createRetrieveHandler({ firebaseAuth });

// We need quite a few middlewares. You can learn more about each of them
// in our API reference docs.
const middlewares = [
  createCaptureMiddleware({ persistHandler }),
  createRetrieveMiddleware({ retrieveHandler }),
  createReplayMiddleware({ maximumDelay: 1000 }),
  // Feel free to add in your own middlewares here
];

// Finally, create our store.
// We need to use our higher-order reducer, which allows us to reset the
// global app state when a new cassette is loaded or ejected.
const store = createStore(
  wrapReducer(reducer),
  applyMiddleware(...middlewares)
);
```

#### Integrate the Replay component

Finally, we want to add the UI to interact with our recorded cassettes!

It is recommended to place it as high in your app as possible, similar to the official Redux devtools.

```js
import { Replay } from 'redux-vcr';

const YourApp = () => (
  <div>
    {/* Your app stuff here */}
    <Replay />
  </div>
)
```

Replay requires no configuration via props, as all of the logic can be configured in the middlewares above. There are some aesthetic tweaks you can make, though.

**That's it! You should be up and running :)**


## Advanced configuration

This setup is good for quick experimentation, but it is ill-suited for production.

You'll want to check out the [production-ready](https://github.com/joshwcomeau/redux-vcr-todomvc/pull/2) diff to see how a production-ready configuration varies.

You can also check out our [API reference docs](API-reference.md), to learn about all the neat configuration Redux VCR currently supports.
