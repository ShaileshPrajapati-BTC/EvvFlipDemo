import * as installBeaconActions from './installBeaconActions'
import _ from 'lodash';
import {SetUuid} from "./installBeaconActions";
import {SET_UUID} from "./installBeaconActions";

const initialState = {
  client_id: '',
  button: true,
  client_name: '',
  uuid:'',
  longitude: '',
  latitude: '',
};

export function InstallBeaconReducer(state = initialState, action) {
  switch (action.type) {
    case installBeaconActions.UPDATE_DATA: {
      return _.assign({}, state, {
        client_id: action.data.client_id,
        button: action.data.button,
        client_name: action.data.client_name
      });
    }
    case installBeaconActions.SET_DATA: {
      return _.assign({}, state, {[action.key]: action.data})
    }
    case installBeaconActions.RESET_DATA: {
      return _.assign({}, state, initialState)
    }
    case installBeaconActions.SET_LOCATION: {
      return _.assign({}, state, {
        longitude: action.data.longitude,
        latitude: action.data.latitude,
      });
    }
    default:
      return state
  }
}