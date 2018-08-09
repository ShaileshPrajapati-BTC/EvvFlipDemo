import { PasswordApi } from "../../api/passwordApi";
import Helper from '../../config/Helper.js';

export const ResetPassword = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return PasswordApi.resetPassword(params, header).then(res => {
      return res.data;
    });
  }
}