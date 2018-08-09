import * as trackingActions from './trackingActions'
import _ from 'lodash';

const initialState = {
  isTrackingStart: false,
  rssiValue: 0,
  latitude: '',
  longitude: '',
  beaconColor: '#d74338',
  distance: 100,//change if we send location in tracking report
  status: 'disconnected',
  mobileLocation: false,
  mobileIsMoving: '',
  mobileBattery: 0,
  lastApiCallTime: null,
  trackData: []
};

export function TrackingReducer(state = initialState, action) {
  switch (action.type) {
    case trackingActions.UPDATE_RSSI_VALUE: {
      return _.assign( {}, state, { rssiValue: action.data.rssiValue, beaconColor: action.data.beaconColor});
    }
    case trackingActions.UPDATE_LOCATION_VALUE:{
      console.log(action)
      return _.assign({}, state, {latitude: action.data.latitude, longitude: action.data.longitude, mobileBattery: action.data.battery, mobileLocation: action.data.location})
    }
    case trackingActions.TRACKING_DATA_CHANGE:{
      console.log(action)
      return _.assign({}, state, {[action.key]: action.data})
    }
    case trackingActions.STORE_TRACKDATA:{
      console.log(action)
      return _.assign({}, state, {trackData: _.concat(state.trackData, action.data)})
    }
    case trackingActions.EMPTY_TRACKDATA:{
      console.log(action)
      return _.assign({}, state, {trackData: action.data})
    }
    default:
      return state
  }
}