import {HttpClient} from './httpClient';

const LOGIN_API = `${HttpClient.base_url}/cargiver/login`;
const LOGOUT_API = `${HttpClient.base_url}/cargiver/logout`;

const login = (params, config) => {
  return HttpClient.post(LOGIN_API, params, config)
}

const logout = (params, config) => {
  return HttpClient.post(LOGOUT_API, params, config)
}

const LoginApi = {
  login,
  logout
}

export {LoginApi}