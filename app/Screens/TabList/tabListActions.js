import { NotificationApi } from "../../api/notificationApi";
import Helper from '../../config/Helper.js';

export const UPDATE_NOTIFICATION_COUNT = 'UPDATE_NOTIFICATION_COUNT' 
export const TAB_LIST_DATA_CHANGE = 'TAB_LIST_DATA_CHANGE'

export const UpdateNotificationCount = () => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return NotificationApi.getNotificationCountFromServer({}, header).then(res => {
      if (res.data.status === true){
        dispatch(UpdateCount(res.data.data.notifications))
        return res.data
      }
    })
  }
}

export const UpdateCount = (data) => {
  return {
    type: UPDATE_NOTIFICATION_COUNT,
    data
  }
}

export const TabListDatatChange = (key, data) => {
  return{
    type: TAB_LIST_DATA_CHANGE,
    key,
    data
  }
}