export default function getQueryParam({ param }) {
  const url = window.location.href;

  // eslint-disable-next-line no-param-reassign
  param = param.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + param + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
