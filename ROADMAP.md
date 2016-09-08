# Roadmap

There are some pretty big plans for Redux VCR!


### Better usage of Firebase, or a new service.

The way we're using Firebase right now is wasteful. We're importing this big library (~200kb before minification/gzip) that specializes in realtime 2-way communication, and we aren't doing anything realtime.

There are also some quality-of-life issues; the fact that it temporarily blocks you in dev if you refresh too often.

The plan should either be:

- Improve Firebase, by:
  - Not anonymously authenticating until the user has taken some actions (based on `startTrigger`, maybe?)
  - Making straightforward API requests instead of using Firebase's realtime client (cut out the big dependency)

OR, we should look for a different, more lightweight service.

OR, we should build alternate persist/retrieve layers, that include a server-side component and hook into the developer's own auth/db.


### UMD build

This is surprisingly nontrivial, because of how the shared dependency works.

When you bundle up, say, ReduxVCR.capture, it's going to include ReduxVCR.shared, which is a 250kb module. ReduxVCR.persist is _also_ going to bundle up the shared dependency.

The quick solution is to provide the entirety of ReduxVCR as a single dependency, since this is good enough for codepen demos, but at some point we should allow individual modules.


### Better documentation

Ideally, developers should be encouraged to write their own modules or addons. We can make it easier by providing better documentation.

We should also provide more examples, a codepen demo, etc.


### Better Replay controls

The VCR is cute, but it's not very powerful. We should add a slider that lets the user "scrub" to a specific point in the timeline, replay from a specific point, etc.


### URL integration

It would be swell if actions updated the query string in the URL, so that a specific point in the cassette can be linked to.


### Admin web app

This is ambitious, but I would like a companion app.

The VCR should not be the main way that users can administrate their cassette collection. A separate interface for CRUD operations could be really helpful.

Bonus points if we can find a way, if both the user's app and the admin app are open in separate tabs in the same Chrome window, to load a cassette in the user's app _from_ the admin app. Maybe via a chrome extension?
