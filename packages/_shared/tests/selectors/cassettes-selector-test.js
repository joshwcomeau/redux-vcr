/* eslint-disable no-unused-expressions, no-unused-vars */
import { expect } from 'chai';

import {
  cassetteListSelector,
  paginatedCassetteListSelector,
  isFirstPageSelector,
  isLastPageSelector,
} from '../../src/reducers/cassettes.reducer';

const defaultState = {
  reduxVCR: {
    cassettes: {
      status: 'idle',
      selected: null,
      byId: {},
      page: {
        number: 0,
        limit: 4,
      },
    },
  },
};

const cassettesById = {
  abc123: { label: 'First cassette', numOfActions: 12, timestamp: 12 },
  def234: { label: 'Another cassette', numOfActions: 3, timestamp: 3 },
  ghi345: { numOfActions: 13, timestamp: 13 },
  jkl456: { label: 'Hello there', numOfActions: 0, timestamp: 0 },
  mno567: { label: 'Yadda yadda', numOfActions: 450, timestamp: 450 },
  pqr678: { numOfActions: 6, timestamp: 6 },
};

let state, selection;

describe('Cassettes selectors', () => {
  describe('cassetteListSelector', () => {
    context('when no cassettes exist', () => {
      before(() => {
        selection = cassetteListSelector(defaultState);
      });

      it('returns an array', () => {
        expect(selection).to.be.an('array');
      });

      it('holds no cassettes', () => {
        expect(selection).to.be.empty;
      });
    });

    context('when holding many cassettes', () => {
      before(() => {
        state = {
          reduxVCR: {
            cassettes: {
              ...defaultState.reduxVCR.cassettes,
              byId: cassettesById,
            },
          },
        };

        selection = cassetteListSelector(state);
      });

      it('returns an array', () => {
        expect(selection).to.be.an('array');
      });

      it('holds all cassettes', () => {
        const numOfCassettes = Object.keys(cassettesById).length;
        expect(selection).to.have.length.of(numOfCassettes);
      });

      it('adds the "id" prop to each item', () => {
        selection.forEach(cassette => {
          expect(cassette.id).to.exist;

          const originalCassette = cassettesById[cassette.id];
          expect(originalCassette).to.exist;

          expect(originalCassette.timestamp).to.equal(cassette.timestamp);
        });
      });

      it('sorts them by their timestamp in descending order', () => {
        selection.forEach((cassette, i) => {
          const nextCassette = selection[i + 1];

          if (!nextCassette) return;

          expect(cassette.timestamp).to.be.greaterThan(nextCassette.timestamp);
        });
      });
    });
  });

  describe('paginatedCassetteListSelector', () => {
    context('when no cassettes exist', () => {
      before(() => {
        selection = paginatedCassetteListSelector(defaultState);
      });

      it('returns an array', () => {
        expect(selection).to.be.an('array');
      });

      it('holds no cassettes', () => {
        expect(selection).to.be.empty;
      });
    });

    context('when holding less cassettes than the page limit', () => {
      before(() => {
        state = {
          reduxVCR: {
            cassettes: {
              ...defaultState.reduxVCR.cassettes,
              byId: cassettesById,
              page: {
                number: 0,
                limit: 100,
              },
            },
          },
        };

        selection = paginatedCassetteListSelector(state);
      });

      it('returns an array', () => {
        expect(selection).to.be.an('array');
      });

      it('holds all cassettes', () => {
        const numOfCassettes = Object.keys(cassettesById).length;
        expect(selection).to.have.length.of(numOfCassettes);
      });
    });

    context('when holding more cassettes than the page limit, on page 1', () => {
      before(() => {
        state = {
          reduxVCR: {
            cassettes: {
              ...defaultState.reduxVCR.cassettes,
              byId: cassettesById,
              page: {
                number: 0,
                limit: 3,
              },
            },
          },
        };

        selection = paginatedCassetteListSelector(state);
      });

      it('holds the first 3 cassettes, by timestamp', () => {
        const sortedCassettes = cassetteListSelector(state);

        expect(selection).to.deep.equal(sortedCassettes.slice(0, 3));
      });
    });


    context('when holding more cassettes than the page limit, on page 2', () => {
      before(() => {
        state = {
          reduxVCR: {
            cassettes: {
              ...defaultState.reduxVCR.cassettes,
              byId: cassettesById,
              page: {
                number: 1,
                limit: 3,
              },
            },
          },
        };

        selection = paginatedCassetteListSelector(state);
      });

      it('holds the next 3 cassettes, by timestamp', () => {
        const sortedCassettes = cassetteListSelector(state);

        expect(selection).to.deep.equal(sortedCassettes.slice(3, 6));
      });
    });
  });

  describe('isFirstPageSelector', () => {
    context('when no cassettes exist', () => {
      before(() => {
        selection = isFirstPageSelector(defaultState);
      });

      it('returns true', () => {
        expect(selection).to.equal(true);
      });
    });

    context('when only one page exists', () => {
      before(() => {
        state = {
          reduxVCR: {
            cassettes: {
              ...defaultState.reduxVCR.cassettes,
              byId: cassettesById,
              page: {
                number: 0,
                limit: 100,
              },
            },
          },
        };

        selection = isFirstPageSelector(defaultState);
      });

      it('returns true', () => {
        expect(selection).to.equal(true);
      });
    });


    context('when on first page', () => {
      before(() => {
        state = {
          reduxVCR: {
            cassettes: {
              ...defaultState.reduxVCR.cassettes,
              byId: cassettesById,
              page: {
                number: 0,
                limit: 3,
              },
            },
          },
        };

        selection = isFirstPageSelector(defaultState);
      });

      it('returns true', () => {
        expect(selection).to.equal(true);
      });
    });

    context('when not on first page', () => {
      before(() => {
        state = {
          reduxVCR: {
            cassettes: {
              ...defaultState.reduxVCR.cassettes,
              byId: cassettesById,
              page: {
                number: 1,
                limit: 6,
              },
            },
          },
        };

        selection = isFirstPageSelector(state);
      });

      it('returns false', () => {
        expect(selection).to.equal(false);
      });
    });
  });

  describe('isLastPageSelector', () => {
    context('when no cassettes exist', () => {
      before(() => {
        selection = isLastPageSelector(defaultState);
      });

      it('returns true', () => {
        expect(selection).to.equal(true);
      });
    });

    context('when only one page exists', () => {
      before(() => {
        state = {
          reduxVCR: {
            cassettes: {
              ...defaultState.reduxVCR.cassettes,
              byId: cassettesById,
              page: {
                number: 0,
                limit: 100,
              },
            },
          },
        };

        selection = isLastPageSelector(defaultState);
      });

      it('returns true', () => {
        expect(selection).to.equal(true);
      });
    });

    context('when not on the last of multiple pages', () => {
      before(() => {
        state = {
          reduxVCR: {
            cassettes: {
              ...defaultState.reduxVCR.cassettes,
              byId: cassettesById,
              page: {
                number: 0,
                limit: 3,
              },
            },
          },
        };

        selection = isLastPageSelector(state);
      });

      it('returns false', () => {
        expect(selection).to.equal(false);
      });
    });

    context('when on the last of multiple pages', () => {
      before(() => {
        state = {
          reduxVCR: {
            cassettes: {
              ...defaultState.reduxVCR.cassettes,
              byId: cassettesById,
              page: {
                number: 1,
                limit: 3,
              },
            },
          },
        };

        selection = isLastPageSelector(state);
      });

      it('returns true', () => {
        expect(selection).to.equal(true);
      });
    });
  });

  context('when on the last of multiple pages, with a not-full page', () => {
    before(() => {
      state = {
        reduxVCR: {
          cassettes: {
            ...defaultState.reduxVCR.cassettes,
            byId: cassettesById,
            page: {
              number: 1,
              limit: 4,
            },
          },
        },
      };

      selection = isLastPageSelector(state);
    });

    it('returns true', () => {
      expect(selection).to.equal(true);
    });
  });

  context('when on the second-to-last page', () => {
    before(() => {
      state = {
        reduxVCR: {
          cassettes: {
            ...defaultState.reduxVCR.cassettes,
            byId: cassettesById,
            page: {
              number: 1,
              limit: 2,
            },
          },
        },
      };

      selection = isLastPageSelector(state);
    });

    it('returns false', () => {
      expect(selection).to.equal(false);
    });
  });

  context('when on the second-to-last page, when the last page is not full', () => {
    before(() => {
      state = {
        reduxVCR: {
          cassettes: {
            ...defaultState.reduxVCR.cassettes,
            byId: {
              ...cassettesById,
              xyz789: {},
            },
            page: {
              number: 1,
              limit: 3,
            },
          },
        },
      };

      selection = isLastPageSelector(state);
    });

    it('returns false', () => {
      expect(selection).to.equal(false);
    });
  });
});
