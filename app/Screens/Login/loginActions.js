import {LoginApi} from "../../api/loginApi";
import Helper from '../../config/Helper.js';
import {EmptyTrackData, StopBeacon} from '../Tracking/trackingActions.js';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'; 
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_DATA_CHANGE = 'LOGIN_DATA_CHANGE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const Login = (params) => {
  return (dispatch, getState) => {
    return LoginApi.login(params).then(res => {
      if (res.data.status == true){
        dispatch(LoginSuccess(res.data.data))
        return res.data
      }
      else{
        return res.data
        dispatch(LoginError(res.data.data))
      }
    })
  }
}

export const Logout = (params) => {
  return (dispatch, getState) => {
    dispatch(MobileChangeData('logoutLoader', true))
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return LoginApi.logout(params, header
      ).then(res => {
      if (res.data.status == true){
        dispatch(LogoutSuccess(res.data.data))
        dispatch(MobileChangeData('logoutLoader', false))
      }
      return res.data
    })
  }
}

export const ClearData = () => {
  return (dispatch, getState) => {
    dispatch(LogoutSuccess([]))
    dispatch(StopBeacon);
    dispatch(EmptyTrackData);
  }
}

export const MobileChange = (key, data) => {
  return (dispatch, getState) => {
    dispatch(MobileChangeData(key, data))
  }
}

export const LoginSuccess = (data) => {
  return {
    type:LOGIN_SUCCESS,
    data
  }
}
export const LoginError = (data) => {
  return {
    type:LOGIN_ERROR,
    data
  }
}
export const MobileChangeData = (key, data) => {
	return{
		type: LOGIN_DATA_CHANGE,
		key,
		data
	}
}
export const LogoutSuccess = (data) => {
  return {
    type:LOGOUT_SUCCESS,
    data
  }
}