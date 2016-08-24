// Takes an object of keys with their relative probability as values.
// eg. { common: 9, rare: 1 }
// In this example, 'common' is 10x more likely to be returned.
/**
 * Returns a random key from the supplied object, weighted by the key's value.
 * @param {object} object - The set of key/values to sample from
 * @example sampleWithProbability({ common: 9, rare: 1 });
 *   -> 'common' or 'rare', with 'common' occurring 10x more often.
 */
export default function sampleWithProbability(object) {
  const weightedCollectionOfKeys = [];

  Object.keys(object).forEach(key => {
    const weight = object[key];

    for (let i = 0; i < weight; i++) {
      weightedCollectionOfKeys.push(key);
    }
  });

  const index = Math.floor(Math.random() * weightedCollectionOfKeys.length);

  return weightedCollectionOfKeys[index];
}
