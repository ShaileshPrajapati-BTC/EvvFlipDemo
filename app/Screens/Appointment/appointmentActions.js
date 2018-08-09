import { AppointmentApi } from "../../api/appointmentApi";
import Helper from '../../config/Helper.js';
import {LoginSuccess} from '../Login/loginActions.js';

export const FETCH_APPOITMENT_LIST = 'FETCH_APPOITMENT_LIST';
export const EMPTY_APPOITMENT_LIST = 'EMPTY_APPOITMENT_LIST';

export const fetchAppointmentList = () => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return AppointmentApi.getAppoitmentList({}, header).then(res => {
      console.log(res, res.data.data.status,"data");
      if (res.data.status === true){
        let groupdata = Helper.groupBy(res.data.data.appointments, app => app.date)
        dispatch(UpdateList(Array.from(groupdata)))
        return res.data.data
      }else{
        let d = [];
        dispatch(EmptyList(d))
        return res.data.data
      }
    })
  }
}

export const getAppointmentStatus = () =>{
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return AppointmentApi.getAppointmentStatus({}, header).then(res =>{
      if(res.data.status === true){
        dispatch(LoginSuccess(res.data.data))
      }
      return res.data
    })
  }
}

export const getNextAppointmentStatus = () =>{
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return AppointmentApi.getNextAppointment({}, header).then(res =>{
      return res.data
    })
  }
}

export const UpdateList = (data) => {
  return {
    type: FETCH_APPOITMENT_LIST,
    data
  }
}
export const EmptyList = (data) => {
  return {
    type: EMPTY_APPOITMENT_LIST,
    data
  }
}