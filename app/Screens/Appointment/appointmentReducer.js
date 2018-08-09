import * as appointmentActions from './appointmentActions'
import _ from 'lodash';

const initialState = {
  appointment: []
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