import React from 'react';

import {Alert, AsyncStorage, Platform} from 'react-native';
import CONFIG from './config.js';
import DeviceInfo from 'react-native-device-info';
import BackgroundGeolocation from "react-native-background-geolocation-android";
import moment from 'moment-timezone';


exports._alertPopupWithCallback = function(title, msg, callback, button_text = "OK"){
  Alert.alert(
    title,
    msg,
    [
      {text: button_text, onPress: () => callback()}
    ],
    { cancelable: false }
  )
}

exports._alertPopup = function(title, msg){
  Alert.alert(
    title,
    msg,
    [
      {text: 'Cancel'},
      {text: 'Ok'}
    ],
    { cancelable: false }
  )
}

exports._alertPopupWithOutCall = function(title, msg){
  Alert.alert(
    title,
    msg,
    [
      {text: 'Ok'}
    ],
    { cancelable: false }
  )
}


exports._sendDeviceInfo = function(token){
  let device = {
    unique_id: DeviceInfo.getUniqueID(),
    device_model: DeviceInfo.getModel(),
    os: Platform.OS,
    os_version: DeviceInfo.getSystemVersion(),
    app_version: DeviceInfo.getVersion()
  }
  console.log("Device information", device);
  return device;
}

exports._greetingText = function(thehours = new Date().getHours()){
  let themessage;
  let morning = ('Good Morning');
  let afternoon = ('Good Afternoon');
  let evening = ('Good Evening');

  if (thehours >= 0 && thehours < 12) {
    themessage = morning;

  } else if (thehours >= 12 && thehours < 17) {
    themessage = afternoon;

  } else if (thehours >= 17 && thehours < 24) {
    themessage = evening;
  }

  return themessage;
}

exports._timeToDecimal = function (hour, minute){
  let minute_to_hours = parseInt(minute)*(1/60);
  let hours = (parseInt(hour) + minute_to_hours)
  return (hours);
}

exports.groupBy = function (list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

exports._containerStyle = function (data){
  if (data.length > 0){
    return {}
  }else{
    return {flex: 1, justifyContent: 'center',alignItems: 'center'}
  }
}

exports._getBaseUrl = function (url){
  return url.replace(/^((\w+:)?\/\/[^\/]+\/?).*$/,'$1');
}

exports._containerStyleTask = function (length, wrap){
  if (length <= 0 && wrap == null){
    return {}
  }else if (length <=0 && wrap !=null){
    return {flex: 1, justifyContent: 'center',alignItems: 'center'}
  }else{
    return {}
  }
}

exports._notificationAlert = function(title,saveClicked){
  Alert.alert(
    title,
    'Are you sure you want to save?',
    [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'OK', onPress: () => saveClicked()},
    ],
    { cancelable: false }
  )
}

exports.getCurrentLocation = function(permission, onSuccess, onFail){
  console.log(permission)
  BackgroundGeolocation.configure({
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    locationAuthorizationRequest: permission,
    locationAuthorizationAlert: {
      titleWhenNotEnabled: "Location Service",
      titleWhenOff: "Location Service",
      instructions: (permission === 'WhenInUse')? CONFIG.while_in_use : CONFIG.always,
      cancelButton: "Cancel",
      settingsButton: "Settings"
    }
  }, (state) => {
    return BackgroundGeolocation.start(() => {
      BackgroundGeolocation.getCurrentPosition(function(location) {
        onSuccess(location);
        console.log("LocationSuccess",location)
      }, function(errorCode) {
        onFail(errorCode);
        console.log("LocationFailed",errorCode)
      }, {
        timeout: 30,      // 30 second timeout to fetch location
        maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
        desiredAccuracy: 25,  // Try to fetch a location with an accuracy of `10` meters.
        samples: 3,// How many location samples to attempt.
        persist: false   
      });
    });
  });
}

exports.setVisitData = function(appointment_module,appointment_id,client_visit_id){
  if(appointment_module === true){
    return({visit: appointment_id,visit_type: 'Appointment'})
  }else{
    return({visit: client_visit_id,visit_type: 'ClientVisit'})
  }
}

exports.checkVisit = function(visit_type, status){
  if (visit_type === "Live-In Visit" && status === "Incomplete") 
    return false 
  else
    return true
}

exports.isRssiAndLocationNotPresent = function(latitude, longitude, rssi_value = null) {
  let isLocationNotPresent =  latitude === '' ||
                              longitude === '' ||
                              latitude === 0 ||
                              longitude === 0;
  if(rssi_value === null) {
    return isLocationNotPresent;
  } else {
    return rssi_value === '0' || rssi_value >= 0 || isLocationNotPresent;
  }                                 
}

exports.toTimeZone = function(time, format="MM-DD-YYYY h:mm A"){
  console.log("time zone-----",time)
  if(time != undefined)
    return moment.unix(time).tz(moment.tz.guess()).format(format);
  else
    return ''
}

exports.timeZoneConvert = function(start_time, end_time){
  let s_time = this.toTimeZone(start_time, "h:mm A");
  let e_time = this.toTimeZone(end_time, "h:mm A");
  return s_time+" to "+ e_time;
}

exports.convertDateToUtc = function(date){
  console.log(date,"date--------------------", moment(date).utc().unix(), moment.tz.guess());
  return moment(date).utc().unix();
}

exports.nextAppointmentInfo = function(date, start_time, end_time){
  return "Your next appointment is on "+ date + " Time: " + this.toTimeZone(start_time,"h:mm A") + " to " + this.toTimeZone(end_time, "h:mm A") + "."
}

exports.padDigits = function(number, digits){
  let number1 = parseInt(number);
  return Array(Math.max(digits - String(number1).length + 1, 0)).join(0) + number1;
}

exports.findAndReplaceString = function(message, find_str, replace_str, format = "MM-DD-YYYY h:mm A"){
  return message.replace(find_str, this.toTimeZone(replace_str, format))
}
exports.prepareHeader = function(token){
  console.log("token--",token)
  return { headers: {access_token: token}}
}

exports.distanceInMeter = function (lat1, lon1, lat2, lon2) {
  let radlat1 = Math.PI * lat1/180;
  let radlat2 = Math.PI * lat2/180;
  let theta = lon1-lon2;
  let radtheta = Math.PI * theta/180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180/Math.PI;
  dist = dist * 60 * 1.1515;
  return dist.toFixed(2) * 1609.344;
}

exports.apiResponseAlert = function (error, message) {
  if(error.response !== undefined){
    this._alertPopup('', message);
  }else{
    this._alertPopup('', CONFIG.something_went_wrong);
  }
}
exports._alertPopupButtonCallBack = function(title, msg, cancelCallback, okCallback, button_text = "OK"){
  Alert.alert(
    title,
    msg,
    [
      {text: 'Cancel',  onPress: () => cancelCallback()},
      {text: button_text, onPress: () => okCallback()}
    ],
    { cancelable: false }
  )
}