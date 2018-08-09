import {HttpClient} from './httpClient';

const BASE_URL = HttpClient.base_url;
const SEND_ALERT = `${BASE_URL}/app_update`;
const VERIFY_STATUS = `${BASE_URL}/cargiver/verify_status`;

const sendAlertToAgency = (params={}, config={}) => {
	return HttpClient.get(SEND_ALERT, params, config)
}
const verifyCaregiverStatus = (params={}, config={}) => {
	return HttpClient.post(VERIFY_STATUS, params, config)
}
const SplashApi = {
	sendAlertToAgency,
	verifyCaregiverStatus
}

export {SplashApi}