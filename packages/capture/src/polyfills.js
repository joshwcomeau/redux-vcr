// performance.now
function performanceNow() {
  // Stub `window` for running in non-browser environments
  // eslint-disable-next-line no-native-reassign
  if (typeof window === 'undefined') { window = {}; }

  if (!window.performance) { window.performance = {}; }

  if (!window.performance.now) {
    if (!Date.now) { Date.now = () => new Date().getTime(); }

    let nowOffset;
    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart;
    } else {
      nowOffset = Date.now();
    }

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }
}

performanceNow();


// Array#find
function arrayFind() {
  if (!Array.prototype.find) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.find = function find(predicate, ...args) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      const list = Object(this);
      const length = list.length >>> 0;
      const [thisArg] = args;
      let value;

      for (let i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }
}

arrayFind();
