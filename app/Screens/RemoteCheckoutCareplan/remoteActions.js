import { AppointmentApi } from "../../api/appointmentApi";
import Helper from '../../config/Helper.js';
import {
  getAppointmentStatus
} from '../Appointment/appointmentActions';

export const fetchRemoteChcekoutCareplan = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return AppointmentApi.getRemoteCheckoutCarePlan(params, header).then(res => {
      console.log(res)
        return res.data
    })
  }
}

export const submitRemoteCheckoutCareplan = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return AppointmentApi.submitRemoteCheckoutCarePlan(params, header).then(res => {
      console.log(res)
      dispatch(getAppointmentStatus());
      return res.data
    })
  }
}