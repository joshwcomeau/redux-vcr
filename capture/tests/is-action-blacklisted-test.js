import { expect } from 'chai';
import sinon from 'sinon';

import { isActionBlacklisted } from '../src/helpers';


const action = { type: 'MATCHED_ACTION' };

describe('isActionBlacklisted', () => {
  it('returns false when no match is found', () => {
    const blacklist = ['UNRELATED', 'OTHER_UNRELATED'];

    expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
  });

  it('returns true when a perfect string match is found', () => {
    const blacklist = ['UNRELATED', 'MATCHED_ACTION'];

    expect(isActionBlacklisted({ action, blacklist })).to.equal(true);
  });

  it('is case sensitive', () => {
    const blacklist = ['matched_action'];

    expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
  });

  describe('error-handling', () => {
    const consoleStub = sinon.stub(console, 'warn');

    afterEach(() => {
      // reset our spies and stubs
      consoleStub.reset();
    });
    after(() => {
      consoleStub.restore();
    });

    it('warns when an object is used with no matchingCriteria', () => {
      const blacklist = [{ type: 'MATCHED_ACTION' }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(true);
      expect(consoleStub.calledOnce).to.equal(true);
    });
  });


  context('with a "contains" object', () => {
    it('returns true when the blacklist type is a subset of the action type', () => {
      const blacklist = [{
        type: 'ED_AC',
        matchingCriteria: 'contains',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(true);
    });

    it('returns true when the blacklist type is equal to the action type', () => {
      const blacklist = [{
        type: 'MATCHED_ACTION',
        matchingCriteria: 'contains',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(true);
    });

    it('returns false when the blacklist type is a superset of the action type', () => {
      const blacklist = [{
        type: 'MATCHED_ACTION_IS_UNMATCHED',
        matchingCriteria: 'contains',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
    });

    it('returns false on a partial, substring match', () => {
      const blacklist = [{
        type: 'MATCHED_ACTO',
        matchingCriteria: 'contains',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
    });
  });


  context('with a "startsWith" object', () => {
    it('returns true when the blacklist type starts with the action type', () => {
      const blacklist = [{
        type: 'MATCHED',
        matchingCriteria: 'startsWith',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(true);
    });

    it('returns true when the blacklist type is equal to the action type', () => {
      const blacklist = [{
        type: 'MATCHED_ACTION',
        matchingCriteria: 'startsWith',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(true);
    });

    it('returns false when the blacklist type ends with the action type', () => {
      const blacklist = [{
        type: 'ACTION',
        matchingCriteria: 'startsWith',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
    });

    it('returns false when the blacklist type is a subset of the action type', () => {
      const blacklist = [{
        type: 'ED_AC',
        matchingCriteria: 'startsWith',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
    });
  });


  context('with a "endsWith" object', () => {
    it('returns true when the blacklist type starts with the action type', () => {
      const blacklist = [{
        type: 'ACTION',
        matchingCriteria: 'endsWith',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(true);
    });

    it('returns true when the blacklist type is equal to the action type', () => {
      const blacklist = [{
        type: 'MATCHED_ACTION',
        matchingCriteria: 'endsWith',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(true);
    });

    it('returns false when the blacklist type starts with the action type', () => {
      const blacklist = [{
        type: 'MATCHED',
        matchingCriteria: 'endsWith',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
    });

    it('returns false when the blacklist type is a subset of the action type', () => {
      const blacklist = [{
        type: 'ED_AC',
        matchingCriteria: 'endsWith',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
    });
  });


  context('with a "perfectMatch" object', () => {
    it('returns true when the blacklist type is equal to the action type', () => {
      const blacklist = [{
        type: 'MATCHED_ACTION',
        matchingCriteria: 'perfectMatch',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(true);
    });

    it('returns false when the blacklist type starts with the action type', () => {
      const blacklist = [{
        type: 'MATCHED',
        matchingCriteria: 'perfectMatch',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
    });

    it('returns false when the blacklist type ends with the action type', () => {
      const blacklist = [{
        type: 'ACTION',
        matchingCriteria: 'perfectMatch',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
    });


    it('returns false when the blacklist type is a subset of the action type', () => {
      const blacklist = [{
        type: 'ED_AC',
        matchingCriteria: 'perfectMatch',
      }];

      expect(isActionBlacklisted({ action, blacklist })).to.equal(false);
    });
  });
});
