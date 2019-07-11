import client from './api-client';

function getResponses(body) {
  return client(`responses`, { body });
}

export { getResponses };
