import client from './api-client';

const localStorageKey = '__pulse_token__';

function handleUserResponse({ token, user }) {
  console.log('handled');
  window.localStorage.setItem(localStorageKey, token);
  return user;
}

function getUser() {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }
  return client('me').catch(error => {
    logout();
    return Promise.reject(error);
  });
}

function login({ email, password }) {
  return client('login', { body: { email, password } })
    .then(handleUserResponse)
    .catch(error => console.log('CE', error));
}

function register({ username, password }) {
  return client('register', { body: { username, password } }).then(handleUserResponse);
}

function logout() {
  window.localStorage.removeItem(localStorageKey);
  return Promise.resolve();
}

function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

export { login, register, logout, getToken, getUser };
