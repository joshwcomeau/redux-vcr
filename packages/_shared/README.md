# Redux VCR / shared

This module holds shared logic between various Redux VCR modules. Specifically, it:

- exports FirebaseHandler, a class that /persist and /retrieve use to send and receive data through Firebase
- Redux structure (reducers, actions, etc) for managing replays. Used by /retrieve and /replay, with possible future uses with the other modules.
