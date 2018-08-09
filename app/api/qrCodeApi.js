import {HttpClient} from './httpClient';

const BASE_URL = HttpClient.base_url;
const CHECK_IN_API = `${BASE_URL}/qrcode/check_in`;
const CHECK_OUT_API = `${BASE_URL}/qrcode/check_out`;
const SUBMIT_CAREPLAN_API = `${BASE_URL}/todolist/update`;

const checkIn = (params, config) => {
  return HttpClient.post(CHECK_IN_API, params, config);
}

const checkOut = (params, config) => {
	return HttpClient.post(CHECK_OUT_API, params, config);
}

const submitCarePlan= (params, config) => {
  return HttpClient.post(SUBMIT_CAREPLAN_API, params, config);
}

const QrCodeApi = {
	checkIn,
	checkOut,
	submitCarePlan
}

export {QrCodeApi}