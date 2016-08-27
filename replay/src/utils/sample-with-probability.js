import seed from 'seed-random';
/**
 * Returns a random value, using the seed if provided.
 * @param {number} min - the minimum (inclusive) value to generate
 * @param {number} max - the maximum (inclusive) value to generate
 * @param {string} seedValue - a string used for predictable randomization
 */
function getRandomValue(min = 0, max = 1, seedValue) {
  const seedFunction = typeof seedValue !== 'undefined' ? seed(seedValue) : seed();
  const initialRandomVal = seedFunction(seedValue);

  return Math.floor(initialRandomVal * (max - min) + min);
}

/**
 * Returns a random key from the supplied object, weighted by the key's value.
 * @param {object} object - The set of key/values to sample from
 * @example sampleWithProbability({ common: 9, rare: 1 });
 *   -> 'common' or 'rare', with 'common' occurring 10x more often.
 */
export default function sampleWithProbability(object, seedValue) {
  const weightedCollectionOfKeys = [];

  Object.keys(object).forEach(key => {
    const weight = object[key];

    for (let i = 0; i < weight; i++) {
      weightedCollectionOfKeys.push(key);
    }
  });

  const index = getRandomValue(0, weightedCollectionOfKeys.length, seedValue);

  return weightedCollectionOfKeys[index];
}
