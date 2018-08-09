import { PasswordApi } from "../../api/passwordApi";
import Helper from '../../config/Helper.js';

export const SetPassword = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return PasswordApi.setPassword(params, header).then(res => {
      return res.data;
    });
  }
}