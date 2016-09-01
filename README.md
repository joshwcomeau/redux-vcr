# ReduxVCR
### A Redux devtool that lets you replay user sessions in real-time.
-- Cute VCR image --


_NOTE: This project is in **early alpha**. I've been using it in production in Key&Pad, but it has not been tested in larger/more complex applications. I do plan on building out this proof-of-concept into a stable, production-ready module :)_

-----------


## Features

#### Insights

By re-watching a recorded session in real-time, you learn tons about how users use your application. Great for gauging UX, spotting bugs, etc.

-- GIF of VCR in action --


#### Developer Experience

Features quality-of-life configuration:
- Max delay between actions: Set a maximum wait time, to remove long gaps when users go idle.
- Speed controls: play your cassettes in 0.5x or 2x speed.
- More to come!


#### Serverless Security

The goal for ReduxVCR was to not need any server-side integration for devs creating front-end-only applications, while still being secure. Using Firebase, we're able to automatically authenticate all users, assuring that they can only edit their own slice of the state, and not read to or write from any other users' sessions.

For replaying the sessions, GitHub OAuth is used. You set which GitHub email you want to have read access within Firebase.


#### Modular Architecture

Rather than create one monolithic package, ReduxVCR consists of 4 individual packages:

- **Capture**
  The capture layer is responsible for watching the stream of actions, selecting the ones that you'd like to record, and augmenting them with timestamps and metadata.

- **Persist**
  The persist layer receives the data from Capture and persists it to Firebase. It handles all anonymous authentication concerns.

- **Retrieve**
  The retrieve layer, meant to be used in development only, fetches the data from Firebase, and handles all admin authentication concerns.

- **Replay**
  Finally, the replay layer is your interface to navigating and watching the recorded cassettes.

An effort has been made to assure that packages can be swapped out. For example, you may wish to use custom database storage, in which case you'd build your own Persist and Retrieve modules. You may wish to have a different UX, in which case you'd build your own Replay module.


#### Straightforward Integration

A fair amount of work has been put into making the integration as simple as possible. For simple apps, the process shouldn't take more than a couple of minutes.


--------


## Getting Started

#### Quickstart

#### Step 1: Sign up for Firebase and create a project

ReduxVCR's Persist and Retrieve modules use Firebase v3.2 for data storage.

Head on over to firebase.google.com and sign up for a free account. Once you make it to [the console](https://console.firebase.google.com/), click 'CREATE NEW PROJECT'.

### Step 2: Set up Authentication

##### 2a: GitHub integration

To view recorded sessions, you'll use GitHub OAuth.

Within Firebase, navigate to the 'SIGN-IN METHOD' page under 'Auth', and click on 'GitHub'. Click the 'Enable' toggle.

In a new tab, [head on over to GitHub and create a new application](https://github.com/settings/applications/new). You'll need to copy/paste the Client ID and Client Secret into Firebase, as well as copy and paste the callback URL from Firebase to GitHub.

Now that your GitHub and Firebase accounts are connected, we can specify data access using Firebase Rules

##### 2b: Firebase Rules

In the left-hand menu, click 'Database', and then select 'RULES' from the main header.

Here are the rules you'll want to implement:

```js
{
  "rules": {
    ".read": "auth.token.email === 'your@email.com'",
    "cassettes": {
      ".indexOn": ["timestamp"],
      "$uid": {
        ".write": "$uid === auth.uid"
      }
    },
    "actions": {
      "$uid": {
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

    Be sure to fill in your GitHub email in the '.read' rule. This is how you specify which users will be able to view the cassettes!

### Step 3: Install

In your terminal, run:

```bash
$ npm i -S redux-vcr.{capture,persist,retrieve,replay}

# This is short-form for:
# $ npm install --save redux-vcr.capture redux-vcr.persist redux-vcr.retrieve redux-vcr.replay
```

### Step 4: Integrate

In your Firebase console, grab your credentials. Select your project, and click "Add Firebase to your web app".

You don't need to copy the entire snippet, we just need the credentials themselves:

```js
var config = {
  apiKey: "AAAAAAA-BBBBB",
  authDomain: "your-project-name.firebaseapp.com",
  databaseURL: "https://your-project-name.firebaseio.com",
  storageBucket: "your-project-name.appspot.com",
};
```

These credentials are safe to expose in the client; the Firebase rules we set up earlier protect us.

This next part will vary depending on your setup, but assuming a typical `configure-store.js` file, you'll want to add the following lines:


```js
import { createCaptureMiddleware } from 'redux-vcr.capture';
import { createPersistHandler } from 'redux-vcr.persist';
import { createRetrieveHandler, createRetrieveMiddleware } from 'redux-vcr.retrieve';
import { createReplayMiddleware, wrapReducer } from 'redux-vcr.replay';

// These are the Firebase credentials from above, renamed and using ES6 'const'
const firebaseAuth = {
  apiKey: "AAAAAAA-BBBBB",
  authDomain: "your-project-name.firebaseapp.com",
  databaseURL: "https://your-project-name.firebaseio.com",
  storageBucket: "your-project-name.appspot.com",
};

// Create a persistHandler. It pushes data from Firebase
const persistHandler = createPersistHandler({ firebaseAuth });

// Create a retrieveHandler. It pulls data from Firebase.
// Note that in a real app, you only want to load this in development.
// See below for real-world configuration
const retrieveHandler = createRetrieveHandler({ firebaseAuth });

// Finally, create all of our middlewares.
// You can read much more about how these work, and what options they accept,
// in the API documentation :)
const middlewares = [
  createCaptureMiddleware({ persistHandler }),
  createRetrieveMiddleware({ retrieveHandler }),
  createReplayMiddleware(),
];

const store = createStore(
  // We use a higher-order reducer to update the state when you replay sessions.
  // Simply pass it your own reducer.
  wrapReducer(reducer),
  applyMiddleware.apply(this, middlewares)
);
```

That's it! You should be up and running :)

### Further Reading

* How it Works
* API Reference
* Deploying in Production


### Roadmap

There are a few pretty blatant things missing from ReduxVCR.

- Event Recording

  Right now, we're _only_ recording the series of Redux actions. Ideally, we'd want our scroll position to mirror the user's, and it would be nice to know where their cursor is.

- Versioning

  There is an assumption made that the app you play the cassette in is identical to the app the cassette was recorded in. In the real world, though, apps change frequently.

  An automated solution is probably impossible (would need access to the filesystem and git)
