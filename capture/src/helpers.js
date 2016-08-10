export const getValues = obj => Object.keys(obj).map(key => obj[key]);

export const isActionBlacklisted = ({ action, blacklist }) => (
  !!blacklist.find(blacklistedAction => {
    let blacklistedActionType, matchingCriteria;

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
      case 'startsWith':
        regexMatcher = `^${blacklistedActionType}`;
      case 'endsWith':
        regexMatcher = `${blacklistedActionType}$`;
      case 'perfectMatch':
        regexMatcher = `^${blacklistedActionType}$`;
      default:
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
  });
);
