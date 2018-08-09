import { QrCodeApi } from "../../api/qrCodeApi";
import Helper from '../../config/Helper.js';
import {LoginSuccess} from '../Login/loginActions';

export const UPDATE_QR_CODE_DATA = 'UPDATE_QR_CODE_DATA';
export const SUBMIT_CAREPLAN_SUCCESS = 'CHECK_OUT_SUCCESS';

export const CheckStatusForCheckInCheckOut = (params) => {
  return (dispatch, getState) => {
    let in_out_status = getState().reducer.login.loginData.in_out_status;
    if(in_out_status === "Out"){
      return dispatch(CheckOut(params))
    }else{
      return dispatch(CheckIn(params))
    } 
  }
}

export const CheckIn = (params) => {
  return (dispatch, getState) => {
		let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    console.log(params, "check ins")
    return QrCodeApi.checkIn(params, header).then(res => {
      if (res.data.status === true){
        dispatch(LoginSuccess(res.data.data))
        return res.data;
      }
      else{
        return res.data;
      }
    });
  }
}

export const CheckOut = (params) => {
  return (dispatch, getState) => {
		let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
        console.log(params, "check outs")
    return QrCodeApi.checkOut(params, header).then(res => {
      if (res.data.status === true){
        dispatch(LoginSuccess(res.data.data))
        return res.data;
      }
      else{
        return res.data;
      }
    });
  }
}

export const SubmitCareplan = (params) => {
  return (dispatch, getState) => {
		let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return QrCodeApi.submitCarePlan(params,header).then(res => {
      if (res.data.status === true){
        dispatch(SubmitCareplanSuccess(res.data.data));
        return res.data;
      }
      else{
        return res.data;
      }
    });
  }
}

export const  UpdateStatusData = (data) => {
  return (dispatch, getState) =>{
    dispatch(LoginSuccess(data))
  }
}
export const UpdateQrCodeData = (data) => {
  return {
    type: UPDATE_QR_CODE_DATA,
    data
  }
}
export const SubmitCareplanSuccess = (data) => {
  return {
    type: SUBMIT_CAREPLAN_SUCCESS,
    data
  }
}