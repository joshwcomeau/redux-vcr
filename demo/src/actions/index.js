export const SELECT_ANSWER = 'SELECT_ANSWER';


export function selectAnswer({ id }) {
  return {
    type: SELECT_ANSWER,
    id,
  };
}
