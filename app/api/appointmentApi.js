import {HttpClient} from './httpClient';

const BASE_URL = HttpClient.base_url;
const APPOITMENT_LIST = `${BASE_URL}/appointments/list`;
const INCOMPLETE_VISIT_LIST = `${BASE_URL}/incomplete_visits`;
const INCOMPLETE_CAREPLAN = `${BASE_URL}/approval/careplan`;
const SUBMIT_INCOMPLETE_CAREPLAN = `${BASE_URL}/approval/update`;
const GET_APPOITMENT_STATUS = `${BASE_URL}/checkstatus/get_status`;
const NEXT_APPOINTMENT = `${BASE_URL}/nextappointment/next_appointment`;
const CHECK_LIST = `${BASE_URL}/todolist/new`;
const REMOTE_CHECKOUT_CAREPLAN = `${BASE_URL}/remote_checkout/new`;
const SUBMIT_REMOTE_CHECKOUT_CAREPLAN = `${BASE_URL}/remote_checkout/create`;
const LIVE_IN_CAREPLAN= `${BASE_URL}/live_in_checklist/careplan`;
const SUBMIT_LIVE_IN_CAREPLAN= `${BASE_URL}/live_in_checklist/update`;

const getAppoitmentList = (params={}, config={}) => {
  return HttpClient.get(APPOITMENT_LIST, params, config)
}

const getIncompletVistList = (params={}, config={}) => {
  return HttpClient.get(INCOMPLETE_VISIT_LIST, params, config)
}

const getIncompletCareplan = (params={}, config={}) => {
  return HttpClient.get(INCOMPLETE_CAREPLAN, params, config)
}

const submitIncompletCareplan = (params={}, config={}) => {
  return HttpClient.post(SUBMIT_INCOMPLETE_CAREPLAN, params, config)
}

const getAppointmentStatus = (params={}, config={}) => {
  return HttpClient.get(GET_APPOITMENT_STATUS, params, config)
}

const getNextAppointment = (params={}, config={}) => {
  return HttpClient.get(NEXT_APPOINTMENT, params, config)
}

const getCheckList = (params={}, config={}) => {
  return HttpClient.get(CHECK_LIST, params, config)
}

const getRemoteCheckoutCarePlan = (params={}, config={}) =>{
  return HttpClient.get(REMOTE_CHECKOUT_CAREPLAN, params, config)
}

const submitRemoteCheckoutCarePlan = (params={}, config={}) =>{
  return HttpClient.post(SUBMIT_REMOTE_CHECKOUT_CAREPLAN, params, config)
}

const getLiveInCarePlan = (params={}, config={}) =>{
  return HttpClient.get(LIVE_IN_CAREPLAN, params, config)
}

const submitLiveInCarePlan = (params={}, config={}) =>{
  return HttpClient.post(SUBMIT_LIVE_IN_CAREPLAN, params, config)
}

const AppointmentApi = {
  getAppoitmentList,
  getIncompletVistList,
  getIncompletCareplan,
  submitIncompletCareplan,
  getAppointmentStatus,
  getNextAppointment,
  getCheckList,
  getRemoteCheckoutCarePlan,
  submitRemoteCheckoutCarePlan,
  getLiveInCarePlan,
  submitLiveInCarePlan
}

export {AppointmentApi}