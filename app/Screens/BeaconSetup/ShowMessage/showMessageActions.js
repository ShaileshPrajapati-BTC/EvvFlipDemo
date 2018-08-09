import { BeaconSetupApi } from "../../../api/beaconSetupApi";
import Helper from '../../../config/Helper.js';

export const beaconUpdate = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return BeaconSetupApi.clientBeaconUpdate(params, header).then(res => {
      console.log(res)
      return res.data
    })
  }
}

export const beaconVerify = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return BeaconSetupApi.clientBeaconVerify(params, header).then(res => {
      console.log(res)
      return res.data
    })
  }
}