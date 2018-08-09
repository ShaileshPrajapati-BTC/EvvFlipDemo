import React, {Component} from 'react';
import {Button, Container, Content, Spinner, Text} from 'native-base';

import {Alert, AsyncStorage, Dimensions, Platform, StatusBar, StyleSheet, Vibration, View} from 'react-native';

import Header from '../../components/back_header.js';
import CONFIG from '../../config/config.js';
import CONSTANTS from '../../config/constants.js';
import Permissions from 'react-native-permissions';
import Loading from '../../components/Loading.js';
import Helper from '../../config/Helper.js';
import ZxingModule from 'react-native-android-zxing-barcode-scanner';
import moment from 'moment-timezone';
import OpenAppSettings from 'react-native-app-settings';
import BeaconFind from '../../components/beacon_find.js';
import _ from 'lodash';
import { StackActions,NavigationActions } from 'react-navigation';

export default class QrCodeComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clock: false,
      camera: true,
      loading: false,
      qr_code_error: CONFIG.check_in_api_error,
      qr_code_status: true,
      ivr_in_out_status: '',
      camera_permisssion: false,
      too_early_check_out_st: ''
    };
    this.appointment_data = [];
  }

  componentWillMount () {
    console.log(this.props, "QrCodde")
    this._getToken();
    this._checkPermission();
    // this._getLocationCoords();
    // this.appointment_data = _.flattenDeep(this.props.appointment_data);
    // if(this.props.longitude === ""){
    //   // this.props.fetchLocation()
    // }
  }
  
  componentDidMount(){
    // remove this
    // this._scan_in_and_out_request("E2C56DB5-DFFB-48D2-B060-0000FFF75248");
  }

  componentWillUnmount(){
    console.log("unmount qr code")
  }

  _navigate(name, msg_obj) {
    // this.props.navigator.resetTo({
    //   name: name,
    //   passProps: {
    //     msg: msg_obj
    //   }
    // })
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({
        routeName: name,
        params: {
          msg: msg_obj,
        }
      })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  // _getLocationCoords(){
  //   console.log("fetch location---------------------->");
  //   let permission = (this.props.userData.location_tracking_permission === "while_in_use") ? "WhenInUse" : "Always"
  //   Helper.getCurrentLocation(permission, (location) => {
  //       this.setState({
  //         cg_logitude: location.coords.longitude,
  //         cg_latitude: location.coords.latitude,
  //         mobile_battery: location.battery.level,
  //         mobile_location: true
  //       });
  //     },
  //     (error) => {
  //       this.setState({
  //         cg_logitude: '',
  //         cg_latitude: '',
  //         mobile_battery: 0,
  //         mobile_location: false
  //       });
  //     } 
  //   )
  // }
  
  async _getToken(){
    if (this.props.userData.in_out_status === "Out"){
      this.setState({
        ivr_in_out_status: 'In',
        clock: 'Check In',
        qr_code_error: CONFIG.check_out_api_error,
        ivr_check_in_msg: CONFIG.ivr_check_out_alert,
        too_early_check_out_st: 'Out'
      });
    }else{
      this.setState({
        ivr_in_out_status: 'Out',
        clock: 'Check Out',
        qr_code_error: CONFIG.check_in_api_error,
        ivr_check_in_msg: CONFIG.ivr_check_in_alert
      });
    }
  }

  async _scan_in_and_out_request(qr_data, failedError=false){
    var $this = this;
    let rssi_value = this.props.rssiValue;
    console.log("Rssi value", this.props.rssiValue)
    try {
      console.log(qr_data);
      let body = {
        beacon_uuid: qr_data,
        longitude: this.props.longitude,
        latitude: this.props.latitude,
        rssi_value: this.props.rssiValue,
        mobile_location: this.props.mobileLocation,
        mobile_battery: this.props.mobileBattery
      }
      this.props.CheckStatusForCheckInCheckOut(body)
      .then((result) =>{
        console.log(result);
        if (result.status === 404 || result.status === 500){
          Helper._alertPopup('', this.state.qr_code_error);
          this.header._back_press();
        }
        else if (result.status === true){
          if (result.data.in_out_status === "In"){
            //Check out process
            console.log($this.state.in_out_status+'------------->');
            if (this.props.userData.user_type === true){
              if(result.data.is_live_in_over === true){
                // this._backFromQrCode();
                this._navigate('TabList', {status: 'success', message: result.message, logout: true});
              }else{
                this.header._alert({status: 'success', message: result.message});
                this._sendTodoList(rssi_value);
              }
            }else{
              this._navigate('TabList', {status: 'success', message: result.message, logout: true});
            }
          }else{
            // Check in Process
            this._navigate('TabList',{status: 'success', message: result.message});
          }
          this.setState({loading: false});
        }
        else if(result.status === false && failedError === false){
          this._navigate('TabList', {status: 'error', message: result.message});
          this.setState({loading: false});
          this.props.StopBeacon();
        }
      })
      .catch((error) => {
        this._alertPopupForIvr($this.state.ivr_check_in_msg, qr_data);
        this.setState({loading: true});
        console.log(error, "========================> _scan_in_and_out_request");        
      });
    }catch(error){
      $this.setState({camera: true});
      console.log(error);
    }
  }

  _setAppointmentData(appointment, data){
    console.log("Set data", data)
    console.log("client data", data.client_id)
    AsyncStorage.setItem("client_id", JSON.stringify(data.client_id));
    AsyncStorage.setItem("longitude", JSON.stringify(data.longitude));
    AsyncStorage.setItem("latitude", JSON.stringify(data.latitude));
    AsyncStorage.setItem("scan_status", JSON.stringify(data.scan_status));
    AsyncStorage.setItem("scan_time", JSON.stringify(data.scan_time));
    AsyncStorage.setItem("clock_status", JSON.stringify(data.clock_status));
    AsyncStorage.setItem("in_out_status", JSON.stringify(data.in_out_status));
    AsyncStorage.setItem("client_name", JSON.stringify(data.client_name));
    AsyncStorage.setItem("uuid", JSON.stringify(data.uuid));
    if (appointment === true){
      AsyncStorage.setItem("appointment_id", JSON.stringify(data.appointment));      
    }
  }
  
  async _onBarCodeRead(result) {
    console.log("resssssssssssssssssssssssss",result);
    let $this = this;
    if($this.state.camera) {
      $this.setState({camera: false, loading: false});
      Vibration.vibrate();
      // 
      if ($this.props.in_out_status === "In"){
        $this.props.UpdateStatusData({in_out_status: 'Out',clock_status: 'Check Out', scan_status: 'Checked In'})
        setTimeout(()=>{
          $this._navigate('TabList', {status: 'success', message: "Checkd In successfully"});
        },1000)
      }else{
        $this.props.UpdateStatusData({in_out_status: 'In', clock_status: 'Check In', scan_status: 'Checked Out'})
        setTimeout(()=>{
          $this._navigate('TabList', {status: 'success', message: "Checkd Out successfully", logout: true});
        },1000)
      }
    }
  }

  _isRssiAndLocationNotPresent() {
    return Helper.isRssiAndLocationNotPresent(this.props.latitude, this.props.longitude, this.props.rssiValue);
  }

  _sendCheckInOutdata(data){
    //Implemented promise to received rssi ID successfully
    if (this.props.userData.in_out_status === 'In'){
      this.props.StartBeacon(data);
    }

    let locationRetryCount = 0;
    let locationPopupShown = false;
    let isRssiAndLocationNotPresent = this._isRssiAndLocationNotPresent();
    console.log("qrcode._isRssiAndLocationNotPresent = ", isRssiAndLocationNotPresent, this.state);
    //Have to wait until the location coordinates are set, with retry count of 4. Otherwise show the alert and move user back to prev. screen.
    if (!isRssiAndLocationNotPresent){
      // this._getLocationCoords();
      this.props.fetchLocation()
    }

    let myTimer = setInterval(() => {  
      isRssiAndLocationNotPresent = this._isRssiAndLocationNotPresent();
      console.log("qrcode._isRssiAndLocationNotPresent = ", isRssiAndLocationNotPresent, this.state, this.props.rssiValue);
      if(isRssiAndLocationNotPresent && locationRetryCount < CONSTANTS.location_and_rssi_wait_retry_count) {
        locationRetryCount+=1;
        // this._getLocationCoords()// fetch location again if not found
        this.props.fetchLocation()
        return;
      } else {
        clearInterval(myTimer);
        if(isRssiAndLocationNotPresent){ //If RSSI OR location, any of them is not present then show alert message to try again.
          if(!locationPopupShown) {
            locationPopupShown = true;
            if (this.props.userData.in_out_status === 'Out'){
              this._scan_in_and_out_request(data, true);
            }
            this.props.StopBeacon();
            Helper._alertPopupWithCallback('', CONFIG.location_rssi_unavailable_message, this._backFromQrCode);
          }
          return;
        }
        this._scan_in_and_out_request(data);
        // this.props.StopBeacon();
      }
    }, 1100);
  }

  _showTooEarlyTooCheckout(data){
    Alert.alert(
      '',
      CONFIG.too_early_check_out_st,
      [
        {text: 'Yes', onPress: () => this._sendCheckInOutdata(data)},
        {text: 'No', onPress: () => this._backFromQrCode()}
      ],
      { cancelable: false }
    )
  }
  
  _filterAppointmentForTooEarlyCheckOut(uuid) {
    console.log("Check-out ===========",this.appointment_data,moment(new Date()).unix());
    return this.appointment_data.filter((appointment) => {
      return appointment.uuid === uuid && (moment(new Date()).unix() <= (appointment.open_end_time)) && (appointment.new_status === 'Working') && appointment.date === moment(new Date()).format("YYYY-MM-DD");
    })
  }

  _backFromQrCode = () => {
    this._navigate('TabList', {});
  }

  async _sendTodoList(rssi_value){
    let signature = (this.props.signature !== undefined) ? this.props.signature : ""
    let data = {
        todo_list: this.props.picker_state,
        extra_milage: this.props.extra_milage,
        injury_status: this.props.injury_status,
        signature: signature,
        call_to_duty_hours: this.props.call_to_duty_hours,
        longitude: this.props.longitude,
        latitude: this.props.latitude,
        rssi_value: rssi_value,
        live_in_questions: this.props.live_in_questions
    }
    let params;
    if (this.props.userData.appointment_module === true){
      params = Object.assign(data, {appointment_id: this.props.userData.scheduling_id});
    }else{
      params = Object.assign(data, {client_visit_id: this.props.userData.scheduling_id});
    }
    try {
      this.props.SubmitCareplan(params)
      .then((res) => {
        console.log(res);
        if (res.status === true){
          this._navigate('TabList', {status: 'success', message: res.message, logout: true});
          this.props.StopBeacon();
          this.props.StopLocation();
        }else{
          this.header._alert({status: 'error', message: res.message});
          this._backFromQrCode();
        }
      })
      .catch((error) => {
        this._backFromQrCode();
        console.log(error, "submit careplan")
      }) 
    }catch(error) {
      console.log("error in send =============", error);
    }
  }

  _requestForPermissions() {    
    Permissions.requestPermission('camera')
      .then(response => {
        console.log(response, "===============================>")
        if (response != 'authorized'){
          Alert.alert(
            'EVV would like to use Your Camera.',
            "EVV use camera to scan QR-code, Please enable it from settings.",
            [
              {text: 'Cancel', style: 'cancel', onPress: this._cancel.bind(this)},
              {text: 'Open Settings', onPress: this._openSettings.bind(this) },
            ],
            { cancelable: false }
          )
        }else{
          if (response === 'authorized'){
            this.setState({loading: true, camera_permisssion: true});
          }
        }
    });
  }

  _openSettings(){
    OpenAppSettings.open();
    this.header._back_press();
  } 
  
  _cancel(){
    this.header._back_press();
  }

  _checkPermission() {
    Permissions.getPermissionStatus('camera')
    .then(response => {
      if (response != 'authorized'){
          this._requestForPermissions();
      }else{
        this.setState({loading: true, camera_permisssion: true});
      }
    });
  }
  
  _alertPopupForIvr(msg, qr_data){
    Helper._alertPopupWithCallback('', msg, () => {this._setIvrData(qr_data)})
  }

  _setIvrData(qr_data){
    if (this.props.userData.appointment_module === true){
      const data = (this.state.ivr_in_out_status === "Out")? this._filterAppointmentForCheckIn(qr_data) : this._filterAppointmentForCheckOut(qr_data)
      if (data.length > 0){
        const new_data = Object.assign( data[0], {in_out_status: this.state.ivr_in_out_status, clock_status: this.state.clock, scan_status: 'N/A' });
        // this._setAppointmentData(true, new_data);
        console.log("appointment data ",new_data);
        if(this.state.ivr_in_out_status === "In"){
          Helper._alertPopupWithOutCall("", CONFIG.ivr_warning_out);
        }else{
          Helper._alertPopupWithOutCall("", CONFIG.ivr_warning_in);
        }
      }else{
        if(this.state.ivr_in_out_status === "In"){
          Helper._alertPopupWithOutCall("", CONFIG.too_early_check_out);
        }else{
          Helper._alertPopupWithOutCall("", CONFIG.Unable_to_find_app);
        }
      }
    }else{
      if(this.state.ivr_in_out_status === "In"){
        Helper._alertPopupWithOutCall("", CONFIG.ivr_warning_out);
      }else{
        Helper._alertPopupWithOutCall("", CONFIG.ivr_warning_in);
      }      
    }
    setTimeout(() => {
      this._navigate('TabList', {});
    }, 500);
  }

  _filterAppointmentForCheckIn(uuid) {
    console.log("Check-in ===========",moment(new Date()).unix());
    return this.appointment_data.filter((appointment) => {
      return appointment.uuid === uuid && moment(new Date()).unix() >= appointment.open_start_time && appointment.new_status === 'Pending' && appointment.date === moment(new Date()).format("YYYY-MM-DD");
    })
  }

  _filterAppointmentForCheckOut(uuid) {
    console.log("Check-out ===========",moment(new Date()).unix());
    return this.appointment_data.filter((appointment) => {
      return appointment.uuid === uuid && (moment(new Date()).unix() >= (appointment.open_end_time - 3600)) && (appointment.new_status === 'Pending' || appointment.new_status === 'Working') && appointment.date === moment(new Date()).format("YYYY-MM-DD");
    })
  }
 
  _validateMessage(){
    return(
      <View style={styles.textStyle}>
        <Text style={{color: 'white', fontSize: 16}}>Validating QR code, please wait..</Text>
      </View>
    )
  }
  
  _renderIosCamera(){
    return(
      <Camera 
        onBarCodeRead = {this._onBarCodeRead.bind(this)} 
        style = {styles.camera} 
        defaultOnFocusComponent = {true}
      >
        <View style={styles.rectangleContainer}>                    
          <View style={styles.rectangle}/>
          {(this.state.loading)? <View/> : this._validateMessage()}
        </View>
      </Camera>
    )
  }

  _renderAndroidCamera(){
    this.setState({qr_code_status: false});
    let scannedQRCode = '';
    ZxingModule.doStartCamera().then((data) => {
      scannedQRCode = data;
      console.log("QRCODE RESULT = " + scannedQRCode);
      this._onBarCodeRead({data: scannedQRCode})
    }).catch((error) =>{
      if (this.props.in_out_status === 'Out'){
        this.header._back_press();
      }else{
        this.props.navigation.goBack();
      }
    });
  }

  _checkPlatform(){
    if (Platform.OS === 'ios'){
      let Camera = [];
      Camera.push(this._renderIosCamera());
      return(Camera);
    }else if(this.state.qr_code_status){
      if (this.state.camera_permisssion){
        this._renderAndroidCamera();
      }
    }
  }
  
  render() {
    return (
      <Container>
        <Header 
          navigator={this.props.navigation}
          ref={(header) => { this.header = header; }} 
          title = {this.props.userData.fullname}
          scanQr = {this.props.in_out_status === 'Out'}
        />
          <StatusBar backgroundColor={CONFIG.theme_color} /> 
            {(this.state.loading)? 
                <Content scrollEnabled={false}>
                  {this._checkPlatform()}
                </Content>
               : (this.state.camera_permisssion)? <BeaconFind/> : <Loading/>}
      </Container>
    );
  }
}

let height = (Platform.OS === 'ios') ? 60 : 78
let styles = StyleSheet.create({

  camera: {
    height: Dimensions.get("window").height - height,
    alignItems: 'center',
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  textStyle:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: 30,
    width: 320,
    marginTop: 30
  }
});