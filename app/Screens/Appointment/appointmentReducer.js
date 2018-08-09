import * as appointmentActions from './appointmentActions'
import _ from 'lodash';

const initialState = {
  appointment:  [  ["2018-08-10", [
                                    {
                                      address:"98 San Jacinto Blvd #1500, Austin Shelley W, San Jacinto Boulevard, Austin, TX, United States-78701",
                                      appointment:1096,
                                      client_id:1,
                                      client_image:"https://staging-evvsystem.s3.amazonaws.com/uploads/client/avatar/1/thumb_b3d14329-ae01-437d-ae11-2fdd78060349.png",
                                      client_name:"vipra",
                                      date:"2018-08-10",
                                      end_time:"11:11",
                                      extended_hours:"",
                                      latitude:30.2616179,
                                      longitude:-97.7422804,
                                      new_status:"Pending",
                                      open_end_time:1533913860,
                                      open_start_time:1533874200,
                                      start_time:"01:10",
                                      status:"Pending",
                                      time:"01:10 AM to 11:11 AM",
                                      utc_end_time:1533913860,
                                      utc_start_time:1533877800,
                                      uuid:"E2C56DB5-DFFB-48D2-B060-0000FFF21600"
                                    },
                                    {
                                      address:"98 San Jacinto Blvd #1500, Austin Shelley W, San Jacinto Boulevard, Austin, TX, United States-78701",
                                      appointment:1096,
                                      client_id:1,
                                      client_image:"https://staging-evvsystem.s3.amazonaws.com/uploads/client/avatar/1/thumb_b3d14329-ae01-437d-ae11-2fdd78060349.png",
                                      client_name:"vipra",
                                      date:"2018-08-10",
                                      end_time:"11:11",
                                      extended_hours:"",
                                      latitude:30.2616179,
                                      longitude:-97.7422804,
                                      new_status:"Pending",
                                      open_end_time:1533913860,
                                      open_start_time:1533874200,
                                      start_time:"01:10",
                                      status:"Pending",
                                      time:"01:10 AM to 11:11 AM",
                                      utc_end_time:1533913860,
                                      utc_start_time:1533877800,
                                      uuid:"E2C56DB5-DFFB-48D2-B060-0000FFF21600"
                                    }
                                  ]
                  ],
                  ["2018-08-11", [
                                    {
                                      address:"98 San Jacinto Blvd #1500, Austin Shelley W, San Jacinto Boulevard, Austin, TX, United States-78701",
                                      appointment:1096,
                                      client_id:1,
                                      client_image:"https://staging-evvsystem.s3.amazonaws.com/uploads/client/avatar/1/thumb_b3d14329-ae01-437d-ae11-2fdd78060349.png",
                                      client_name:"vipra",
                                      date:"2018-08-10",
                                      end_time:"11:11",
                                      extended_hours:"",
                                      latitude:30.2616179,
                                      longitude:-97.7422804,
                                      new_status:"Pending",
                                      open_end_time:1533913860,
                                      open_start_time:1533874200,
                                      start_time:"01:10",
                                      status:"Pending",
                                      time:"01:10 AM to 11:11 AM",
                                      utc_end_time:1533913860,
                                      utc_start_time:1533877800,
                                      uuid:"E2C56DB5-DFFB-48D2-B060-0000FFF21600"
                                    },
                                    {
                                      address:"98 San Jacinto Blvd #1500, Austin Shelley W, San Jacinto Boulevard, Austin, TX, United States-78701",
                                      appointment:1096,
                                      client_id:1,
                                      client_image:"https://staging-evvsystem.s3.amazonaws.com/uploads/client/avatar/1/thumb_b3d14329-ae01-437d-ae11-2fdd78060349.png",
                                      client_name:"vipra",
                                      date:"2018-08-10",
                                      end_time:"11:11",
                                      extended_hours:"",
                                      latitude:30.2616179,
                                      longitude:-97.7422804,
                                      new_status:"Pending",
                                      open_end_time:1533913860,
                                      open_start_time:1533874200,
                                      start_time:"01:10",
                                      status:"Pending",
                                      time:"01:10 AM to 11:11 AM",
                                      utc_end_time:1533913860,
                                      utc_start_time:1533877800,
                                      uuid:"E2C56DB5-DFFB-48D2-B060-0000FFF21600"
                                    }
                                  ]
                  ]
                ]
};

export function AppointmentReducer(state = initialState, action) {
  switch (action.type) {
    case appointmentActions.FETCH_APPOITMENT_LIST: {
      return _.assign( {}, state, { appointment: action.data });
    }
    case appointmentActions.EMPTY_APPOITMENT_LIST: {
      return _.assign( {}, state, { appointment: [] });
    }
    default:
      return state
  }
}