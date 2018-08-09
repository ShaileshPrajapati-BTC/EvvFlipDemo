import {HttpClient} from './httpClient';

const BASE_URL = HttpClient.base_url;
const RESET_PASSWORD_API = `${BASE_URL}/reset_password`;
const FORGOT_PASSWORD_API = `${BASE_URL}/forgot_password_with_otp`;
const OTP_VERIFY_API = `${BASE_URL}/verify_otp/verify`;
const SET_PASSWORD = `${BASE_URL}/verify_otp/reset_password`;

//Create
const resetPassword = (params, config) => {
  return HttpClient.post(RESET_PASSWORD_API, params, config);
}
const forgotPassword = (params, config) => {
  return HttpClient.post(FORGOT_PASSWORD_API, params, config);
}
const otpVerify = (params, config) => {
  return HttpClient.post(OTP_VERIFY_API, params, config);
}
const setPassword = (params, config) => {
  return HttpClient.post(SET_PASSWORD, params, config);
}

const PasswordApi = {
  resetPassword,
  forgotPassword,
  otpVerify,
  setPassword
}

export {PasswordApi}