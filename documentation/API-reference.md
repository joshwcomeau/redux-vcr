# API Reference

## Table of Contents

- Capture
  - createCaptureMiddleware
- Persist
  - createPersistHandler
- Retrieve
  - createRetrieveMiddleware
  - createRetrieveHandler
- Replay
  - createReplayMiddleware
  - Replay (component)


-----------------


## Capture

### `createCaptureMiddleware({ persistHandler, blacklist, startTrigger })`

A factory function for creating [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html) that will be used for capturing all relevant actions, and passing them to a persist handler.


#### Arguments

#### `persistHandler`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object` | `undefined` | `true` |


The `persistHandler` is an object responsible for submitting the captured data to some external storage. For it to be valid, it must expose a `persist` method.

Redux VCR ships with a default persist handler, that uses Firebase as a data store. See `Persist` below.


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


#### `startTrigger`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `String` | `undefined` | `false` |

Sometimes, you may wish to omit the start of a session (eg. user onboarding, registration).

In this case, you may begin capturing the state after a specific action has been dispatched. The current snapshot of the state at that point will be captured, so that the session can be replayed with any pre-existing state preserved.

The value you provide needs to be a perfect match for the action type being dispatched, and dispatching the specified action multiple times will have no effect.


#### `minimumActionsToPersist`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Number` | `0` | `false` |

To avoid cluttering a cassette list with short, meaningless sessions, you may choose to specify a minimum number of actions before the Persist method is applied.

For example, a `minimumActionsToPersist` of 5 means that, for the first 4 actions in the app, no data is persisted. Once the 5th action is dispatched, though, the entire sequence of actions is persisted.

This is different from `startTrigger`: where `startTrigger` completely ignores actions before the trigger, `minimumActionsToPersist` includes the whole session.

When used together, `minimumActionsToPersist` starts counting once the `startTrigger` has been dispatched. For example, if we've set our `startTrigger` to 'ONBOARDING_COMPLETED', and our `minimumActionsToPersist` to 3, our session would be persisted 3 actions after 'ONBOARDING_COMPLETED' (no matter how many actions happened before 'ONBOARDING_COMPLETED'), and it would not include any data from before 'ONBOARDING_COMPLETED'.


#### Returns

A Redux middleware.





## Persist

### `createPersistHandler({ firebaseAuth, debounceLength })`

#### Arguments

#### `firebaseAuth`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object` | `undefined` | `true` |


The default PersistHandler uses Firebase to persist its data. It requires basic Firebase authentication data. This data is safe to use inside client-side code.

For more information, see [Getting Started with Firebase](placeholder.com).


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




## Retrieve

### `createRetrieveMiddleware({ retrieveHandler, appName, requiresAuth })`

A function that will create a [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html) that will be used for retrieving previously-persisted cassettes.

#### Arguments

#### `retrieveHandler`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object` | `undefined` | `true` |

The `retrieveHandler` is an object responsible for fetching captured data from some external storage.

Redux VCR ships with a default retrieve handler, that uses Firebase as a data store. See `RetrieveHandler` below.


#### `requiresAuth`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Boolean` | `true` | `false` |

By default, it is assumed that previously-persisted cassettes are private, and should only be retrieved for users who have authenticated.

When `requiresAuth` is set to `false`, the retrieve handler will not try to auto-login, and it will update the state so that your Replay components know not to force a login before requesting the cassettes.

Note that setting `requiresAuth` to false **does not** grant access to cassettes; this is handled in Firebase security rules. This prop merely affects what requests get made to Firebase, it does not affect whether those requests are authorized or not.


#### `appName`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `String` | `undefined` | `false` |

For convenience, the Retrieve middleware will remember any successful login attempts by persisting the access token in localStorage.

By default, this access token is stored under the `redux-vcr-app` key.

However, if you plan on using Redux VCR in multiple applications, you don't want one app overwriting the credentials of another!

For this reason, you may supply a custom app name. It will be used to create the localStorage key, in the format of `redux-vcr-${appName}`.


#### `initialCassetteId`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `String` | `undefined` | `false` |

Sometimes, you may want to initialize Redux VCR with a specific cassette. For example, you may wish to add query param support so you can link to a specific cassette, or you may wish to load the last-playing cassette from localStorage.

For apps with authentication required to view cassettes, the initial cassette will be loaded as soon as authentication completes. For all-access apps, the cassette will be fetched after the components are mounted.

If you do not require authentication to view cassettes (not recommended for anything beyond a toy app), it will happen on pageload. Otherwise, it'll fetch the cassette once you've authenticated.




### `createRetrieveHandler({ firebaseAuth })`

#### Arguments


#### `firebaseAuth`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object` | `undefined` | `false` |


To retrieve persisted data from Firebase, your retrieveHandler requires basic Firebase authentication data. This data is safe to use inside client-side code.

For more information, see [Getting Started with Firebase](placeholder.com).


### Example usage:

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


## Replay

### `createReplayMiddleware`

#### Arguments

#### `replayHandler`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Object` | `undefined` | `false` |


The `replayHandler` is responsible for sequencing and replaying the retrieved actions.

It is an optional argument; a default `playHandler` will be used if none is provided.


### `new ReplayHandler`

#### Arguments (to constructor)


#### `maximumDelay`

| **Accepted Types:** | **Default Value:** | **Required:**
|---------------------|--------------------|---------------|
|  `Number` | `undefined` | `false` |


TODO: Make this state live in the reducer, along with playbackSpeed.
You can set an initial value, but you can also change it after the fact.

Sometimes, our users may idle when using our application. We can specify a maximum delay between actions, in milliseconds, to clamp this idle time to a maximum value.

For example, a value of `1000` means that no more than 1 second will elapse between actions, even if the user waited 5 minutes before continuing. Actions that occur within 1 second are not affected.


#### Example usage:

```js
const replayHandler = new RetrieveHandler({
  maximumDelay: 1000,
});

const replayMiddleware = createReplayMiddleware({ replayHandler });
```


#### `wrapReducer`

This higher-order reducer allows for Replay to work its magic. It merges in Redux VCR state, without affecting the hierarchy of your existing state. It also allows for state resets, in the event of ejecting the current cassette and starting a new one.

It takes your current `reducer` as input, and returns a new reducer.

#### Example usage:

```js
const store = createStore(wrapReducer(reducer))
```
