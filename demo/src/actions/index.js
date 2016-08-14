export const SELECT_ANSWER = 'REDUX_VCR_DEMO/SELECT_ANSWER';


export function selectAnswer({ id }) {
  return {
    type: SELECT_ANSWER,
    id,
  };
}
