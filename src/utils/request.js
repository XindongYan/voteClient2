import fetch from 'dva/fetch';
const api = 'http://127.0.0.1:3000'

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw response;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  options.body = JSON.stringify(options.body);
  Object.assign(options.headers, {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  });

  return fetch(api + url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => { throw err });
}
