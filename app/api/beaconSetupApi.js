import {HttpClient} from './httpClient';

const BASE_URL = HttpClient.base_url;

const CLIENT_LIST = `${BASE_URL}/clients/list`;
const BEACON_UPDATE =  `${BASE_URL}/clients/beacon_update`;
const BEACON_VERIFY =  `${BASE_URL}/clients/beacon_verify`;

const getClientList = (params={}, config={}) => {
  return HttpClient.get(CLIENT_LIST, params, config)
}

const clientBeaconUpdate = (params={}, config={}) => {
  return HttpClient.post(BEACON_UPDATE, params, config)
}

const clientBeaconVerify = (params={}, config={}) => {
  return HttpClient.post(BEACON_VERIFY, params, config)
}

const BeaconSetupApi = {
  getClientList,
  clientBeaconUpdate,
  clientBeaconVerify
}

export {BeaconSetupApi}