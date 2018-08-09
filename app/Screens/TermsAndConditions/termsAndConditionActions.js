import { TermsAndConditionApi } from "../../api/termsAndConditionApi";
import Helper from '../../config/Helper.js';

export const GetTermsAndConditionUrl = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return TermsAndConditionApi.getTermsAndConditionUrl(params, header).then(res => {
      return res.data;
    });
  }
}

export const UpdateTermsAndConditionUrl = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return TermsAndConditionApi.updateTermsAndCondition(params, header).then(res => {
      return res.data;
    });
  }
}