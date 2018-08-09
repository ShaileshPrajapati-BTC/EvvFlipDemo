import { SplashApi } from "../../api/splashApi";
import Helper from '../../config/Helper.js';


export const sendAlertToAgency = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return SplashApi.sendAlertToAgency({}, header).then(res => {
      return res.data
    })
  }
}

export const verifyCaregiverStatus = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return SplashApi.verifyCaregiverStatus(params, header).then(res => {
      return res.data
    })
  }
}