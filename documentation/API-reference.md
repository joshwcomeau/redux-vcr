# API Reference

## Table of Contents

- [Capture](#capture)
  - [createCaptureMiddleware](#createcapturemiddleware-persisthandler-blacklist-starttrigger-minimumactionstopersist-)
- [Persist](#persist)
  - [createPersistHandler](#createpersisthandler-firebaseauth-debouncelength-)
- [Retrieve](#retrieve)
  - [createRetrieveMiddleware](#createretrievemiddleware-retrievehandler-appname-requiresauth-initialcassetteid-)
  - [createRetrieveHandler](#createretrievehandler-firebaseauth-)
  - [getQueryParam](#getqueryparam-param-)
- [Replay](#replay)
  - [createReplayMiddleware](#createreplaymiddleware-replayhandler-maximumdelay-overwritecassettestate-onplay-onpause-onstop-oneject-)
  - [wrapReducer](#wrapreducer)
  - [`<Replay />`](#replay-)


-----------------


## Capture

### `createCaptureMiddleware({ persistHandler, blacklist, startTrigger, minimumActionsToPersist })`

A factory function for creating [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html) that will be used for capturing all relevant actions, and passing them to a persist handler.

#### Returns

A Redux middleware.

#### Arguments

#### `persistHandler`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object` | `undefined` | `true` |


The `persistHandler` is an object responsible for submitting the captured data to some external storage. For it to be valid, it must expose a `persist` method.

Redux VCR ships with a default persist handler, that uses Firebase as a data store. See `Persist` below.

---

#### `blacklist`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `[String/Object]` | `[]` | `false` |


Sometimes, you may wish to ignore certain actions as they pass through your store. The blacklist is a simple but powerful way of excluding actions.

The default format for an item in the blacklist is an object with:
- `type`: A string representing the action type you'd like to ignore

- `matchingCriteria`: a method used to evaluate whether or not the action type matches the blacklist item's type. Acceptable values are:
  - `perfectMatch`
  - `startsWith`
  - `endsWith`
  - `contains`

##### Valid blacklist items:

- `{ type: 'DO_THING', matchingCriteria: 'perfectMatch' }`

  Will match and ignore the `DO_THING` redux action

- `{ type: 'USERS/', matchingCriteria: 'startsWith' }`

  Will match any action starting with 'USERS/'. Eg. 'USERS/ADD_NEW', 'USERS/DELETE'...

- `{ type 'USERS', matchingCriteria: 'contains' }`

  Will match any action containing the string 'USERS'.

##### Notes:

- For convenience, you may pass a `String` instead of an `Object`. Strings are treated as `perfectMatch` objects.

- All actions related to Redux VCR (eg. fetching cassettes, playing cassettes) are automatically excluded.

---

#### `startTrigger`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `String` | `undefined` | `false` |

Sometimes, you may wish to omit the start of a session (eg. user onboarding, registration).

In this case, you may begin capturing the state after a specific action has been dispatched. The current snapshot of the state at that point will be captured, so that the session can be replayed with any pre-existing state preserved.

The value you provide needs to be a perfect match for the action type being dispatched, and dispatching the specified action multiple times will have no effect.

---

#### `minimumActionsToPersist`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Number` | `0` | `false` |

To avoid cluttering a cassette list with short, meaningless sessions, you may choose to specify a minimum number of actions before the Persist method is applied.

For example, a `minimumActionsToPersist` of 5 means that, for the first 4 actions in the app, no data is persisted. Once the 5th action is dispatched, though, the entire sequence of actions is persisted.

This is different from `startTrigger`: where `startTrigger` completely ignores actions before the trigger, `minimumActionsToPersist` includes the whole session.

When used together, `minimumActionsToPersist` starts counting once the `startTrigger` has been dispatched. For example, if we've set our `startTrigger` to 'ONBOARDING_COMPLETED', and our `minimumActionsToPersist` to 3, our session would be persisted 3 actions after 'ONBOARDING_COMPLETED' (no matter how many actions happened before 'ONBOARDING_COMPLETED'), and it would not include any data from before 'ONBOARDING_COMPLETED'.



----------------------------
----------------------------



## Persist


### `createPersistHandler({ firebaseAuth, debounceLength })`

A function that will create a PersistHandler that will be used for saving cassettes. The default module (`redux-vcr.persist`) uses Firebase for persistence.


#### Returns

A `PersistHandler` object that exposes a `persist` method.

#### Arguments

#### `firebaseAuth`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object` | `undefined` | `true` |


The default PersistHandler uses Firebase to persist its data. It requires basic Firebase authentication data. This data is safe to use inside client-side code.

For more information, see [Firebase Configuration](firebase-config.md).

---

#### `debounceLength`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Number` | `undefined` | `false` |


If your application fires many actions quickly, you may wish to employ a debounce to avoid spamming Firebase with requests. The number you provide will be the length, in milliseconds, that is required to elapse without any actions before the data will be persisted.

### Example usage:

```js
const persistHandler = createPersistHandler({
  firebaseAuth: {
    apiKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    authDomain: 'your-sub-domain.firebaseapp.com',
    databaseURL: 'https://your-sub-domain.firebaseio.com',
  },
  debounceLength: 100,
});

const persistMiddleware = createPersistMiddleware({ persistHandler });
```



----------------------------
----------------------------



## Retrieve

### `createRetrieveMiddleware({ retrieveHandler, appName, requiresAuth, initialCassetteId })`

A function that will create a [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html) that will be used for retrieving previously-persisted cassettes.

#### Returns

A Redux middleware.

#### Arguments

#### `retrieveHandler`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object` | `undefined` | `true` |

The `retrieveHandler` is an object responsible for fetching captured data from some external storage.

Redux VCR ships with a default retrieve handler, that uses Firebase as a data store. See `RetrieveHandler` below.

---

#### `requiresAuth`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Boolean` | `true` | `false` |

By default, it is assumed that previously-persisted cassettes are private, and should only be retrieved for users who have authenticated.

When `requiresAuth` is set to `false`, the retrieve handler will not try to auto-login, and it will update the state so that your Replay components know not to force a login before requesting the cassettes.

Note that setting `requiresAuth` to false **does not** grant access to cassettes; this is handled in Firebase security rules. This prop merely affects what requests get made to Firebase, it does not affect whether those requests are authorized or not.

---

#### `appName`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `String` | `undefined` | `false` |

For convenience, the Retrieve middleware will remember any successful login attempts by persisting the access token in localStorage.

By default, this access token is stored under the `redux-vcr-app` key.

However, if you plan on using Redux VCR in multiple applications, you don't want one app overwriting the credentials of another!

For this reason, you may supply a custom app name. It will be used to create the localStorage key, in the format of `redux-vcr-${appName}`.

---

#### `initialCassetteId`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `String` | `undefined` | `false` |

Sometimes, you may want to initialize Redux VCR with a specific cassette. For example, you may wish to add query param support so you can link to a specific cassette, or you may wish to load the last-playing cassette from localStorage.

For apps with authentication required to view cassettes, the initial cassette will be loaded as soon as authentication completes. For all-access apps, the cassette will be fetched after the components are mounted.

If you do not require authentication to view cassettes (not recommended for anything beyond a toy app), it will happen on pageload. Otherwise, it'll fetch the cassette once you've authenticated.


----------------------------


### `createRetrieveHandler({ firebaseAuth })`
A function that will create a RetrieveHandler that will be used for retrieving cassettes. The default module (`redux-vcr.persist`) uses Firebase for storage.

#### Returns

A `RetrieveHandler` object that exposes several methods consumed by the Retrieve middleware.

#### Arguments


#### `firebaseAuth`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object` | `undefined` | `false` |


To retrieve persisted data from Firebase, your retrieveHandler requires basic Firebase authentication data. This data is safe to use inside client-side code.

For more information, see [Firebase Configuration](firebase-config.md).


#### Example usage:

```js
const retrieveHandler = createRetrieveHandler({
  firebaseAuth: {
    apiKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    authDomain: 'your-sub-domain.firebaseapp.com',
    databaseURL: 'https://your-sub-domain.firebaseio.com',
  },
});

const retrieveMiddleware = createRetrieveMiddleware({ retrieveHandler });
```


----------------------------



### `getQueryParam({ param })`

A simple helper to get the value of a query parameter.

#### Returns
The value of the requested param (as a string), or `null` if no match is found.

#### Arguments

#### param

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `String` | `undefined` | `true` |

The name of the query parameter you want to fetch.

For example, given the URL `http://www.website.com/home?name=Josh`, `getQueryParam({ param: 'name' })` would return `Josh`.



----------------------------
----------------------------



## Replay

### `createReplayMiddleware({ replayHandler, maximumDelay, overwriteCassetteState, onPlay, onPause, onStop, onEject })`

#### Returns

A Redux middleware.

#### Arguments

#### `replayHandler`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object` | `undefined` | `false` |


The `replayHandler` is responsible for sequencing and replaying the retrieved actions.

It is an optional argument; a default `playHandler` will be used if none is provided.

---

#### `maximumDelay`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Number` | `undefined` | `false` |

The maximum amount of time, in milliseconds, to wait between actions.

This is useful for trimming large gaps in the cassette, when users go idle. By setting it to 5000, you'll never have to wait more than 5 seconds between actions.

If no value is provided, no trimming will occur.

---

#### `overwriteCassetteState`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object`/`Function` | `undefined` | `false` |

Sometimes, you may wish to overwrite the initial state of a cassette. This is useful for when you want to ignore certain inconsistencies, or force all cassettes to start with the same initial state.

This can either be an object or a function.
* If an object is provided, it is deep-merged into the cassette's initial state.
* If a function is provided, it is invoked with the cassette's initial state. The function's return value will be used as the new initial state.

#### Example usage:

```js
// Object example
createReplayMiddleware({
  maximumDelay: 1000,
  overwriteCassetteState: {
    adminMode: true,
  },
});

// Function example
createReplayMiddleware({
  maximumDelay: 1000,
  overwriteCassetteState(initialState) {
    return {
      ...initialState,
      adminMode: true,
    };
  },
});

```

---

#### `onPlay`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Function` | `undefined` | `false` |

A custom function you may provide that will be invoked right after a cassette starts playing.

It's invoked with the store's dispatch, and the store's getState. Similar to redux-thunk.


#### `onPause`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Function` | `undefined` | `false` |

A custom function you may provide that will be invoked right after a cassette is paused.

It's invoked with the store's dispatch, and the store's getState. Similar to redux-thunk.

---

#### `onStop`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Function` | `undefined` | `false` |

A custom function you may provide that will be invoked right after a cassette is stopped.

It's invoked with the store's dispatch, and the store's getState. Similar to redux-thunk.

---

#### `onEject`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Function` | `undefined` | `false` |

A custom function you may provide that will be invoked right after a cassette is ejected.

It's invoked with the store's dispatch, and the store's getState. Similar to redux-thunk.


----------------------------


### `wrapReducer`

This higher-order reducer allows for Replay to work its magic. It merges in Redux VCR state, without affecting the hierarchy of your existing state. It also allows for state resets, in the event of ejecting the current cassette and starting a new one.

It takes your current `reducer` as input, and returns a new reducer.

#### Example usage:

```js
const store = createStore(wrapReducer(reducer))
```

----------------------------


### `<Replay />`

Drop this component in to create a VCR UI for managing cassettes.

While almost all of the config is managed through the middlewares above, there are some cosmetic tweaks that can be set by passing props to `<Replay />`.

#### `doorLabel`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `String` | `HI-FI STEREO SYSTEM` | `false` |

As an homage to retro VCR units, the default value is a feature common to such devices. While this is silly and cosmetic, it can be overwritten to any expression you'd like.

---

#### `cassettesBackdropColor`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `String` | `#FFF` | `false` |

When selecting a cassette from the list, a backdrop falls over your application. This prop allows you to specify a custom color (for dark-themed applications, you likely want this to be the hex code for black, #000).

---

#### `cassettesBackdropOpacity`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Number` | `0.9` | `false` |

When selecting a cassette from the list, a backdrop falls over your application. This prop allows you to specify a custom opacity, from 0 to 1.
