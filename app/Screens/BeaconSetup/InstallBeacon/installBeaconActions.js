import { BeaconSetupApi } from "../../../api/beaconSetupApi";
import Helper from '../../../config/Helper.js';
export const UPDATE_DATA = 'UPDATE_DATA';
export const RESET_DATA = 'RESET_DATA';
export const SET_DATA = 'SET_DATA';
export const SET_LOCATION = 'SET_LOCATION';

export const fetchClientList = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return BeaconSetupApi.getClientList(params, header).then(res => {
      console.log(res)
      return res.data
    })
  }
}

export const fetchLocation = () => {
  return (dispatch, getState) => {
    let permission = (getState().reducer.login.loginData.location_tracking_permission === "while_in_use") ? "WhenInUse" : "Always"
    Helper.getCurrentLocation(permission, (position) => {
      console.log(position, "from method")
      dispatch(UpdateLocation(position.coords))
    }, (error) => {
      console.log(error, "from error method")
      dispatch(UpdateLocation({longitude: '', latitude: ''}))
    });
  }
}

export const updateSetupData = (params) => {
  return (dispatch, getState) => {
    dispatch(UpdateData(params))
  }
}

export const resetSetupData = (params) => {
  return (dispatch, getState) => {
    dispatch(ResetData(params))
  }
}

export const BeaconSetupDataChange = (key, data) => {
  return (dispatch, getState) => {
    dispatch(ChangeData(key, data))
  }
}
export const UpdateData = (data) => {
  return {
    type:UPDATE_DATA,
    data
  }
}

export const ResetData = (data) => {
  return {
    type:RESET_DATA,
    data
  }
}
export const ChangeData = (key,data) => {
  return {
    type:SET_DATA,
    key,
    data
  }
}
export const UpdateLocation = (data) =>{
  return {
    type:SET_LOCATION,
    data
  }
}