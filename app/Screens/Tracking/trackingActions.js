import { TrackingApi } from "../../api/trackingApi";
import Helper from '../../config/Helper.js';
import CONFIG from '../../config/config.js';
import _ from 'lodash';
import {
  Platform,
  DeviceEventEmitter,
  NativeAppEventEmitter
} from 'react-native';

// import Beacons from 'react-native-beacons-manager';
// import BackgroundGeolocation from "react-native-background-geolocation-android";

let beacon_for_check_in_check_out = null;
let last_api_call_time = null;
const EventEmitter = Platform.select({
  ios: () => NativeAppEventEmitter,
  android: () => DeviceEventEmitter,
})();

export const UPDATE_RSSI_VALUE = 'UPDATE_RSSI_VALUE';
export const UPDATE_LOCATION_VALUE = 'UPDATE_LOCATION_VALUE';
export const TRACKING_DATA_CHANGE = 'TRACKING_DATA_CHANGE';
export const STORE_TRACKDATA = 'STORE_TRACKDATA';
export const EMPTY_TRACKDATA = 'EMPTY_TRACKDATA';

export const StartLocation = (uuid) =>{
  return (dispatch, getState) =>{
    let location_permission = getState().reducer.login.loginData.location_tracking_permission;
    BackgroundGeolocation.configure({
      // Geolocation Config
      stopOnTerminate: false,
      preventSuspend: true,
      heartbeatInterval: 60,
      stationaryRadius:10,
      desiredAccuracy: 0,
      distanceFilter: 5,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      locationAuthorizationRequest: (location_permission === "while_in_use") ? "WhenInUse" : "Always",
      locationAuthorizationAlert: {
        titleWhenNotEnabled: "Location Service",
        titleWhenOff: "Location Service",
        instructions: (location_permission === 'while_in_use')? CONFIG.while_in_use : CONFIG.always,
        cancelButton: "Cancel",
        settingsButton: "Settings"
      }
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        // 3. Start tracking!
        BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
      }
    });
    dispatch(LocationProviderChange());
  }
}

export const LocationProviderChange = () => {
  return (dispatch, getState) => {
    let location_permission = getState().reducer.login.loginData.location_tracking_permission;
    let in_out_status = getState().reducer.login.loginData.in_out_status;
    BackgroundGeolocation.on('providerchange', function(provider) {
      console.log('- Provider Change: ', provider);
      console.log('  enabled: ', provider.enabled);
      console.log('  gps: ', provider.gps);
      console.log('  network: ', provider.network);
      console.log('  status: ', provider.status);
      dispatch(TrackingDataChange('mobileLocation', provider.gps));
      if(Platform.OS === 'ios'){
        if(provider.status === BackgroundGeolocation.AUTHORIZATION_STATUS_ALWAYS && location_permission == 'while_in_use' && in_out_status == 'Out') {
          BackgroundGeolocation.setConfig({
            locationAuthorizationRequest: 'WhenInUse'
          });
          BackgroundGeolocation.start();
        } else if (provider.status === BackgroundGeolocation.AUTHORIZATION_STATUS_WHEN_IN_USE && location_permission == 'Always' && in_out_status == 'Out') {
          BackgroundGeolocation.setConfig({
            locationAuthorizationRequest: 'Always'
          });
          BackgroundGeolocation.start();
        }  
      }
    });
  }
}

export const StartBeacon = (uuid) =>{
  return (dispatch, getState) => {
    let region = {
      identifier: 'REGION1',
      uuid: uuid
    };
    if (Platform.OS === 'ios'){
      Beacons.requestWhenInUseAuthorization();
      Beacons.startRangingBeaconsInRegion(region);
      Beacons.startUpdatingLocation();
    }else{
      Beacons.detectAltBeacons();
      Beacons.setBackgroundScanPeriod(1000);
      Beacons.setForegroundScanPeriod(1000);
      Beacons.stopRangingBeaconsInRegion(region);
      Beacons.startRangingBeaconsInRegion(
        'REGION1',
        uuid
      )
      .then(
        () => console.log('Beacons ranging started successfully')
      )
      .catch(
        error => console.log(`Beacons ranging not started, error: ${error}`)
      );  
    }
    dispatch(TrackingDataChange('isTrackingStart', true));
    
    if (getState().reducer.tracking.isTrackingStart && beacon_for_check_in_check_out == null){
      console.log("tracking start")
      last_api_call_time = (new Date()).getTime();
      beacon_for_check_in_check_out = DeviceEventEmitter.addListener(
        'beaconsDidRange',
        (data) => {
          console.log("dsd", data);
          if (data.beacons.length < 1){
            dispatch(UpdateRssiValue({rssiValue: 0, beaconColor: '#d74338'}));
            dispatch(TrackingDataChange('status', 'disconnected'));
          }else{
            dispatch(UpdateRssiValue({rssiValue: data.beacons[0].rssi, beaconColor: '#00B325'}));
            dispatch(TrackingDataChange('status', 'connected'));
          }
          dispatch(StartFiveMinuteTracking());
        }
      );
    }
  }
}

export const StopBeacon = (from_logout=false, uuid = null) => {
  return (dispatch, getState) => {
    let userData = getState().reducer.login.loginData;
    let beacon_data = {
            identifier: 'REGION1',
            uuid: uuid || userData.uuid
          }
    if (userData.in_out_status === 'In' || from_logout){
      if (beacon_for_check_in_check_out != null){
        console.log(beacon_for_check_in_check_out, "const---------")
        beacon_for_check_in_check_out.remove();
        beacon_for_check_in_check_out = null;
        if (Platform.OS === 'ios'){
          Beacons.stopUpdatingLocation();
        }
        last_api_call_time = null
        BackgroundGeolocation.stop()
        if(userData.uuid !== null){
          console.log("Stop--------",beacon_data)
          // Beacons.stopMonitoringForRegion(beacon_data);
          Beacons.stopRangingBeaconsInRegion(beacon_data);          
        }
      }
      dispatch(TrackingDataChange('isTrackingStart', false));
      dispatch(TrackingDataChange('status', 'disconnected'));
      dispatch(UpdateRssiValue({rssiValue: 0, beaconColor: '#d74338'}));
    }
  }
}

export const StartFiveMinuteTracking = () => {
  return (dispatch, getState) => {
    let current_time = new Date().getTime();
    console.log("on Location change",last_api_call_time, current_time);
    if (Math.round((current_time - last_api_call_time)/1000) >= 900){
      console.log("inside method")
      last_api_call_time = (new Date()).getTime();
      dispatch(SendAppOpenTracking())
    }else{
      console.log("time difference ----> ",Math.round((current_time - last_api_call_time)/1000));
    }
  }
}

export const SendAppOpenTracking = () => {
  return (dispatch, getState) => {
    let state = getState().reducer;
    let userData = state.login.loginData;
    let tracking = state.tracking;
    if (userData.in_out_status === 'Out'){
      console.log("inside method")
      let data = [{
        appointment_id: userData.appointment_module ? userData.scheduling_id : '' ,
        client_visit_id: userData.appointment_module ? '' : userData.scheduling_id,
        uuid: userData.uuid,
        rssi_value: tracking.rssiValue,
        battery_strength: '',
        longitude: '',
        latitude: '',
        distance: userData.distance,
        status: tracking.status,
        time: JSON.parse(JSON.stringify(new Date())),
        mobile_location: false,
        mobile_is_moving: false,
        mobile_battery: 0
      }];
      dispatch(SendTrackingReport(data))
    }else{
      console.log("Not checkd in");
    }
  }
}

export const fetchLocation = () =>{
  return (dispatch, getState) =>{
    let permission = getState().reducer.login.loginData.location_tracking_permission === "while_in_use" ? "WhenInUse" : "Always";
    Helper.getCurrentLocation(permission, (location) => {
      dispatch(UpdateLocation({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          battery: location.battery.level,
          location: true
        }))
      },
      (error) => {
        dispatch(UpdateLocation({
          longitude: '',
          latitude: '',
          battery: 0,
          location: false
        }));
      } 
    )
  }
}
export const StopLocation = () =>{
  return (dispatch, getState) => {
    BackgroundGeolocation.removeAllListeners();
    BackgroundGeolocation.stop();
  }
}

export const SendTrackingReport = (params) => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    let old_data = getState().reducer.tracking.trackData;
    let data;
    if (old_data != undefined){
      data = _.concat(params, old_data);
    }else{
      data = params;
    }
    let body =  {
      track_datas: data,
      client_id: getState().reducer.login.loginData.client_id
    }
    console.log(body, "ddd");
    return TrackingApi.submitTrackingData(body, header).then(res => {
      console.log(res, "tracking")
      if(res.data.status === true){
        dispatch(EmptyTrackData([]))
      }
      return res.data
    }).catch(error =>{
      dispatch(StoreTrackData());
    })
  }
}

export const UpdateRssiValue = (data) => {
  return {
    type: UPDATE_RSSI_VALUE,
    data
  }
}

export const UpdateLocation = (data) => {
  return{
    type: UPDATE_LOCATION_VALUE,
    data
  }
}

export const StoreTrackData = (data) => {
  return{
    type: STORE_TRACKDATA,
    data
  }
}
export const EmptyTrackData = (data) => {
  return{
    type: EMPTY_TRACKDATA,
    data
  }
}
export const TrackingDataChange = (key, data) => {
  return{
    type: TRACKING_DATA_CHANGE,
    key,
    data
  }
}