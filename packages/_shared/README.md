# ReduxVCR.shared

This module holds shared logic between various Redux VCR modules. Specifically, it:

- exports FirebaseHandler, a class that ReduxVCR.persist and ReduxVCR.retrieve use to send and receive data through Firebase

- Redux structure (reducers, actions, etc) for managing replays. Used by ReduxVCR.retrieve and ReduxVCR.replay, with possible future uses with the other modules

- exports various helpers and polyfills
