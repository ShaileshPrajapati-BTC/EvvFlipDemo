import {NotificationApi} from "../../api/notificationApi";
import Helper from '../../config/Helper.js';
// import FCM from 'react-native-fcm';

export const FETCH_NOTIFICATION_LIST = 'FETCH_NOTIFICATION_LIST';
export const EMPTY_NOTIFICATION_LIST = 'EMPTY_NOTIFICATION_LIST';


export const fetchNotificationList = () => {
  return (dispatch, getState) => {
    // FCM.removeAllDeliveredNotifications();
    // FCM.cancelAllLocalNotifications();
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return NotificationApi.getNotificationList({}, header).then(res => {
      console.log(res, res.data.data.status,"data")
      if (res.data.status === true){
        dispatch(UpdateNotificationList(res.data.data.notifications))
        return res.data.data
      }else{
        let d = [];
        dispatch(EmptyNotificationList(d))
        return res.data.data
      }
    })
  }
}

export const submitInteractionCheckList = (params) =>{
  return(dispatch, getState) =>{
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return NotificationApi.submitInterActionCheckList(params, header).then(res => {
      console.log(res.data, "data")
      return res.data
    })
  }
}

export const submitVisitStatusLocation = (params) =>{
  return(dispatch, getState) =>{
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return NotificationApi.submitVisitStatusLocation(params, header).then(res => {
      console.log(res, "------------------------data")
      return res.data
    })
  }
}

export const submitDashboardCommentResponse = (params) =>{
  return(dispatch, getState) =>{
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return NotificationApi.submitDashboardCommentResponse(params, header).then(res => {
      console.log(res, "------------------------data")
      return res.data   
    })
  }
}

export const extendAppointment = (params) =>{
  return(dispatch, getState) =>{
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return NotificationApi.extendAppointment(params, header).then(res => {
      console.log(res, "------------------------data")
      return res.data   
    })
  }
}

export const UpdateNotificationList = (data) => {
  return {
    type: FETCH_NOTIFICATION_LIST,
    data
  }
}
export const EmptyNotificationList = (data) => {
  return {
    type: EMPTY_NOTIFICATION_LIST,
    data
  }
}