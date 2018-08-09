import {HttpClient} from './httpClient';

const BASE_URL = HttpClient.base_url;
const SEDN_TRACKING_DATA = `${BASE_URL}/tracking/get_track`;

const submitTrackingData = (params={}, config={}) => {
  return HttpClient.post(SEDN_TRACKING_DATA, params, config)
}

const TrackingApi = {
  submitTrackingData
}

export {TrackingApi}