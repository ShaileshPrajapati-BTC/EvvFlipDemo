import * as notificationActions from './notificationActions'
import _ from 'lodash';

const initialState = {
  notification: [{
                    client_image:"https://staging-evvsystem.s3.amazonaws.com/uploads/client/avatar/1/thumb_b3d14329-ae01-437d-ae11-2fdd78060349.png",
                    client_name:"vipra",
                    id:8907,
                    message:"Your visit with vipra starts in 10 minutes.",
                    notification_type:3,
                    read_status:false,
                    response_status:"Pending",
                    running_late_by:"",
                    sender_name:"botree tesr",
                    time:"08/09/2018 01:00 AM -04:00",
                    utc_time_fields:{greeting_time: 1533790844, message_typo: "%{greetings}. Your visit with vipra starts in 10 minutes."},
                    visit:1095,
                    visit_type:"Appointment"
                  },
                  {
                    client_image:"https://staging-evvsystem.s3.amazonaws.com/uploads/client/avatar/1/thumb_b3d14329-ae01-437d-ae11-2fdd78060349.png",
                    client_name:"vipra",
                    id:8905,
                    message:"Your visit with vipra starts in 25 minutes.",
                    notification_type:3,
                    read_status:true,
                    response_status:"Failed To Reply",
                    running_late_by:"",
                    sender_name:"botree tesr",
                    time:"08/09/2018 12:45 AM -04:00",
                    utc_time_fields:{greeting_time: 1533789943, message_typo: "%{greetings}. Your visit with vipra starts in 25 minutes."},
                    visit:1095,
                    visit_type:"Appointment"
                  }]
};

export function NotificationReducer(state = initialState, action) {
  switch (action.type) {
    case notificationActions.FETCH_NOTIFICATION_LIST: {
      return _.assign( {}, state, { notification: action.data });
    }
    case notificationActions.EMPTY_NOTIFICATION_LIST: {
      return _.assign( {}, state, { notification: [] });
    }
    default:
      return state
  }
}