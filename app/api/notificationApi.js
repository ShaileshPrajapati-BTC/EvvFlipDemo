import {HttpClient} from './httpClient';

const BASE_URL = HttpClient.base_url;
const NOTIFICATION_COUNT = `${BASE_URL}/notifications/pending/count`;
const NOTIFICATION_LIST = `${BASE_URL}/notifications/list`;
const INTERACTION_CHECKLIST = `${BASE_URL}/checklist_task`;
const VISIT_STATUS = `${BASE_URL}/visit_status`;
const DASHBOARD_COMMENT_RESPONSE = `${BASE_URL}/dashboard_notification_response/respond`;
const EXTEND_APPOITMENT = `${BASE_URL}/extend_appointment/extend`;


const getNotificationCountFromServer = (params={}, config={}) => {
  return HttpClient.get(NOTIFICATION_COUNT, params, config)
}

const getNotificationList = (params={}, config={}) => {
  return HttpClient.get(NOTIFICATION_LIST, params, config)
}

const submitInterActionCheckList = (params, config) => {
  return HttpClient.post(INTERACTION_CHECKLIST, params, config)
}

const submitVisitStatusLocation = (params, config) => {
  return HttpClient.post(VISIT_STATUS, params, config)
}

const submitDashboardCommentResponse = (params, config) => {
  return HttpClient.post(DASHBOARD_COMMENT_RESPONSE, params, config)
}

const extendAppointment = (params, config) => {
  return HttpClient.post(EXTEND_APPOITMENT, params, config)
}

const NotificationApi = {
  getNotificationCountFromServer,
  getNotificationList,
  submitInterActionCheckList,
  submitVisitStatusLocation,
  submitDashboardCommentResponse,
  extendAppointment
}

export {NotificationApi}