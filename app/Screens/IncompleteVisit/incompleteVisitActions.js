import { AppointmentApi } from "../../api/appointmentApi";
import Helper from '../../config/Helper.js';

export const FETCH_INCOMPLETE_APPOITMENT_LIST = 'FETCH_INCOMPLETE_APPOITMENT_LIST';
export const EMPTY_INCOMPLETE_APPOITMENT_LIST = 'EMPTY__INCOMPLETE_APPOITMENT_LIST';

export const fetchIncompleteAppointmentList = () => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return AppointmentApi.getIncompletVistList({}, header).then(res => {
      console.log(res)
      if (res.data.status == true){
        let groupdata = Helper.groupBy(res.data.data.visits, app => app.date)
        dispatch(UpdateIncompleteList(Array.from(groupdata)))
        return res.data.data
      }else{
        let d = [];
        dispatch(EmptyIncompleteList(d))
        return res.data.data
      }
    })
  }
}

export const UpdateIncompleteList = (data) => {
  return {
    type: FETCH_INCOMPLETE_APPOITMENT_LIST,
    data
  }
}
export const EmptyIncompleteList = (data) => {
  return {
    type: EMPTY_INCOMPLETE_APPOITMENT_LIST,
    data
  }
}