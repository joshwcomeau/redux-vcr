import { expect } from 'chai';

import { isActionBlacklisted } from '../src/helpers';

const action = { type: 'MATCHED_ACTION' };

describe('isActionBlacklisted', () => {
  context('with strings', () => {
    it('returns false when no match is found', () => {
      const blacklist = ['UNRELATED', 'OTHER_UNRELATED'];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
    });

    it('returns true when a string match is found', () => {
      const blacklist = ['UNRELATED', 'MATCHED_ACTION'];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(true);
    });
  });

  context('with a "contains" object', () => {
    it('returns true when an object match is found', () => {
      const blacklist = [{
        type: 'ED_AC',
        matchingCriteria: 'perfectMatch',
      }];
    });

    it('returns false when no match is found', () => {
      const blacklist = [{
        type: `MATCHED_ACTION_IS_UNMATCHED`,
        matchingCriteria: 'perfectMatch',
      }];
    });
  });
});
