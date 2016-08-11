// eslint-disable-next-line import/prefer-default-export
export const isActionBlacklisted = ({ action, blacklist }) => (
  !!blacklist.find(blacklistedAction => {
    let blacklistedActionType;
    let matchingCriteria;

    // `blacklistedAction` can either be a string, or an object containing
    // a `type` and a `matchingCriteria`.
    // Use sensible defaults if a string is provided.
    if (typeof blacklistedAction === 'object') {
      blacklistedActionType = blacklistedAction.type;
      matchingCriteria = blacklistedAction.matchingCriteria;
    } else {
      blacklistedActionType = blacklistedAction;
      matchingCriteria = 'perfectMatch';
    }

    let regexMatcher;
    switch (matchingCriteria) {
      case 'contains':
        regexMatcher = blacklistedActionType;
        break;
      case 'startsWith':
        regexMatcher = `^${blacklistedActionType}`;
        break;
      case 'endsWith':
        regexMatcher = `${blacklistedActionType}$`;
        break;
      case 'perfectMatch':
        regexMatcher = `^${blacklistedActionType}$`;
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn(`
          WARNING from ReduxVCR/capture.
          You neglected to provide suitable matching criteria for your
          blacklisted actions. Acceptable values are "contains", "startsWith",
          "endsWith", and "perfectMatch". You provided ${matchingCriteria}.

          Defaulting to "perfectMatch".
        `);

        regexMatcher = `^${blacklistedActionType}$`;
    }

    return action.type.match(new RegExp(regexMatcher));
  })
);
