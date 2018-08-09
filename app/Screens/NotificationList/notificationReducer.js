import * as notificationActions from './notificationActions'
import _ from 'lodash';

const initialState = {
  notification: []
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