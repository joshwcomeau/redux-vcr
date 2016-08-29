export const SELECT_ANSWER = 'SELECT_ANSWER';
export const COMPLETE_ONBOARDING = 'COMPLETE_ONBOARDING';


export const selectAnswer = ({ id }) => ({
  type: SELECT_ANSWER,
  id,
});

export const completeOnboarding = () => ({
  type: COMPLETE_ONBOARDING,
});
