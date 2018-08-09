import {AppointmentApi} from "../../api/appointmentApi";
import Helper from '../../config/Helper.js';

export const fetchLiveCheckList = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return AppointmentApi.getCheckList(params, header).then(res => {
      console.log(res)
        return res.data
    })
  }
}

export const submitIncompleteCareplan = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return AppointmentApi.submitIncompletCareplan(params, header).then(res => {
      console.log(res)
        return res.data
    })
  }
}