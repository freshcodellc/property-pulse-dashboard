function client(endpoint, { body, ...customConfig } = {}) {
  const token = window.localStorage.getItem('__pulse_token__');
  const headers = { 'content-type': 'application/json' };
  if (token) {
    headers.Authorization = `${token}`;
  }

  let config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(handleErrors)
    .then(r => r.json());
}

function handleErrors(response) {
  if (!response.ok) {
    console.log('R', response);
    throw Error(response.message);
  }
  return response;
}

export default client;
