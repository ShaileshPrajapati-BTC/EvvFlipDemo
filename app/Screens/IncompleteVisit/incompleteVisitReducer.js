import * as incompleteVisitActions from './incompleteVisitActions';
import _ from 'lodash';

const initialState = {
  incompleteVisitList: [
                        ["2018-05-02", [{
                                          client_id:3,
                                          client_image:"https://staging-evvsystem.s3.amazonaws.com/uploads/client/avatar/3/thumb_e2a43a7f-dfe2-4e86-98d8-973659c1bace.png",
                                          client_name:"Tanvi",
                                          date:"2018-05-02",
                                          extended_hours:"",
                                          status:"Incomplete",
                                          utc_end_time:1525322700,
                                          utc_start_time:1525271666,
                                          visit:974,
                                          visit_type:"ClientVisit",
                                          visit_type_status:"Hourly Visit"},
                                        {
                                          client_id:3,
                                          client_image:"https://staging-evvsystem.s3.amazonaws.com/uploads/client/avatar/3/thumb_e2a43a7f-dfe2-4e86-98d8-973659c1bace.png",
                                          client_name:"Tanvi",
                                          date:"2018-05-02",
                                          extended_hours:"",
                                          status:"Need Approval",
                                          utc_end_time:1525322700,
                                          utc_start_time:1525271666,
                                          visit:974,
                                          visit_type:"ClientVisit",
                                          visit_type_status:"Hourly Visit"
                                        }]
                        ],
                        ["2018-05-03", [{
                                          client_id:3,
                                          client_image:"https://staging-evvsystem.s3.amazonaws.com/uploads/client/avatar/3/thumb_e2a43a7f-dfe2-4e86-98d8-973659c1bace.png",
                                          client_name:"Tanvi",
                                          date:"2018-05-02",
                                          extended_hours:"",
                                          status:"Resubmit",
                                          utc_end_time:1525322700,
                                          utc_start_time:1525271666,
                                          visit:974,
                                          visit_type:"ClientVisit",
                                          visit_type_status:"Hourly Visit"},
                                        {
                                          client_id:3,
                                          client_image:"https://staging-evvsystem.s3.amazonaws.com/uploads/client/avatar/3/thumb_e2a43a7f-dfe2-4e86-98d8-973659c1bace.png",
                                          client_name:"Tanvi",
                                          date:"2018-05-02",
                                          extended_hours:"",
                                          status:"Need Approval",
                                          utc_end_time:1525322700,
                                          utc_start_time:1525271666,
                                          visit:974,
                                          visit_type:"ClientVisit",
                                          visit_type_status:"Hourly Visit"
                                        }]
                          ]
    ]
};

export function IncompleteVisitReducer(state = initialState, action) {
  switch (action.type) {
    case incompleteVisitActions.FETCH_INCOMPLETE_APPOITMENT_LIST: {
      return _.assign( {}, state, { incompleteVisitList: action.data });
    }
    case incompleteVisitActions.EMPTY_INCOMPLETE_APPOITMENT_LIST: {
      return _.assign( {}, state, { incompleteVisitList: [] });
    }
    default:
      return state
  }
}