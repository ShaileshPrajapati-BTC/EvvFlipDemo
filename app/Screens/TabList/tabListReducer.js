import * as tablistActions from './tabListActions'
import _ from 'lodash';

const initialState = {
  side_menu: false,
  location_service: true,
  bluetooth_service: true,
  notificationCountData:{pending_count:2, incomplete_visit_count: 2}
};

export function TabListReducer(state = initialState, action) {
  switch (action.type) {
    case tablistActions.UPDATE_NOTIFICATION_COUNT: {
      return _.assign( {}, state, { notificationCountData: _.assign({}, state.notificationCountData, action.data) });
    }
    case tablistActions.TAB_LIST_DATA_CHANGE:{
      console.log(action)
      return _.assign({}, state, {[action.key]: action.data})
    }
    default:
      return state
  }
}