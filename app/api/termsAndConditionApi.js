import {HttpClient} from './httpClient';

const BASE_URL = HttpClient.base_url;
const TERMS_AND_CONDITION_URL = `${BASE_URL}/user/agency/terms_and_conditions`;
const TERMS_AND_CONDITION_UPDATE = `${BASE_URL}/user/terms_and_conditions`;

const getTermsAndConditionUrl = (params={}, config={}) => {
  return HttpClient.get(TERMS_AND_CONDITION_URL, params, config)
}

const updateTermsAndCondition = (params={}, config={}) => {
  return HttpClient.post(TERMS_AND_CONDITION_UPDATE, params, config)
}

const TermsAndConditionApi = {
  getTermsAndConditionUrl,
  updateTermsAndCondition
}

export {TermsAndConditionApi}