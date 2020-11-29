import axios from 'axios';
import history from './browserHistory';

const ApiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    }
});

const token = getToken();
if (token !== null) setToken(token);

ApiClient.interceptors.response.use(
  (response) => { // intercept the global error
    return response;
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 404) {
      logout();
    }

    return Promise.reject(error);
})

function setToken(token: string) {
  ApiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
  window.localStorage.setItem('SPEECH_NOTES_TOKEN', token);
}

function removeToken() {
  window.localStorage.removeItem('SPEECH_NOTES_TOKEN');
}

function logout() {
  removeToken();
  history.push('/login');
}

function getToken() {
  return window.localStorage.getItem('SPEECH_NOTES_TOKEN');
}

function hasToken() {
  return getToken() !== null;
}

export {ApiClient as default, setToken, hasToken, logout};
