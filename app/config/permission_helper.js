
import {Platform} from 'react-native';
import BleManager from 'react-native-ble-manager';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

exports.askToEnableBluetooth = function(resolve, reject){
  
  if (Platform.OS === 'ios'){
    BleManager.start({showAlert: false, allowDuplicates: false})
    .then(() => {
      return resolve();
    })
    .catch((error) => {
      console.log('The user refuse to enable blue tooth');
      return reject(error);
    });
  }else{
    BleManager.enableBluetooth()
    .then(() => {
      return resolve();
    })
    .catch((error) => {
      console.log('The user refuse to enable blue tooth');
      return reject(error);
    });
  }
}

exports.askToEnableLocation = function(resolve, reject){

  if (Platform.OS === 'android'){
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2>Enable Location</h2>EVV want to use location for tracking, Please enable it from settings.<br/><br/>",
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => ONLY GPS PROVIDER
        showDialog: true // false => Opens the Location access page directly
    }).then(() => {
      return resolve();
    }).catch((error) => {
      return reject(error);
    });
  }else{
    // LinkingIOS.openURL('app-settings:');
    return resolve();
  }
}
