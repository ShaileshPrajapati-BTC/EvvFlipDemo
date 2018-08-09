import { AppointmentApi } from "../../api/appointmentApi";
import Helper from '../../config/Helper.js';

export const fetchLiveInCareplan = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return AppointmentApi.getLiveInCarePlan(params, header).then(res => {
      console.log(res)
      return res.data
    })
  }
}

export const submitLiveInCareplan = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return AppointmentApi.submitLiveInCarePlan(params, header).then(res => {
      console.log(res)
      return res.data
    })
  }
}