import React,{Component} from 'react';
import {
  Container,
  Content,
  Button,
  Spinner
} from 'native-base';

import {
  View,
  StyleSheet, 
  Dimensions,
  StatusBar,
  Alert,
  Platform,
  Vibration
  } from 'react-native';

import Header from '../../../components/back_header.js';
import { RNCamera as Camera } from 'react-native-camera';
import CONFIG from '../../../config/config.js';
import Permissions from 'react-native-permissions';
import Loading from '../../../components/Loading.js';
import ZxingModule from 'react-native-android-zxing-barcode-scanner';
import OpenAppSettings from 'react-native-app-settings';
import { NavigationActions } from 'react-navigation';

export default class ScanQrCode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      camera: true,
      loading: false,
      camera_permisssion: false,
      qr_code_status: true
    };
  }

  componentWillReceiveProps(){
    console.log("will---")
  }

  componentWillMount () {
    // if (this.props.navigation.state.params != null){
    //   let params = this.props.navigation.state.params;
    //   this.setState({
    //     button: params.button,
    //     client_id: params.client_id,
    //     client_name: params.client_name});
    //   console.log("inside scan qr cod", this.state.button, this.state.client_id);
    // }
    console.log("props--",this.props)
    this._checkPermission();
  }
  
  componentDidMount(){
    //this._onBarCodeRead({data: "E2C56DB5-DFFB-48D2-B060-0000FFF21343"})
  }

  _navigate(name) {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     params: params
    //   }
    // })
    const navigate = NavigationActions.navigate({
      routeName: name
    });
    this.props.navigation.dispatch(navigate);
  }

  async _onBarCodeRead(result) {
    console.log("resssssssssssssssssssssssss",result);
    let $this = this;
    if($this.state.camera) {
      $this.props.BeaconSetupDataChange('uuid',result.data);
      Vibration.vibrate();
      $this.setState({camera: false, loading: true});
      $this._navigate('ShowMessage');
    }
  }

  _requestForPermissions() {
    Permissions.requestPermission('camera')
      .then(response => {
        console.log(response, " -- Permissions.requestPermission('camera') ===============================>")
        if (response !== 'authorized'){
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
    this.header._back_to_setup_beacon();
  } 
  
  _cancel(){
    this.header._back_to_setup_beacon();
  }

  _checkPermission() {
    console.log("check permission")
    Permissions.getPermissionStatus('camera')
      .then(response => {
        console.log(response, " -- Permissions.requestPermission('camera') ---------------------------->")
        if (response !== 'authorized'){
            this._requestForPermissions();
        }else{
          this.setState({loading: true, camera_permisssion: true});
          console.log("permist", this.state)
        }
    });
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
    console.log("android camera")
    let self = this;
     this.setState({qr_code_status: false});
     let scannedQRCode = '';
      ZxingModule.doStartCamera().then((data) => {
      scannedQRCode = data;
      console.log("QRCODE RESULT = " + scannedQRCode);

      this._onBarCodeRead({data: scannedQRCode})
    }).catch(function(error) {
      self.header._back_to_setup_beacon();
    });
  }

  _checkPlatform(){
    if (Platform.OS === 'ios'){
      let Camera = [];
      Camera.push(this._renderIosCamera());
      console.log("ios", Camera)
      return(Camera);
    }else if(this.state.qr_code_status){
      console.log("android ddddd")
      if (this.state.camera_permisssion){
        console.log("android");
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
          beacon_setup={this.props.button}
          qr_code = {true}
          title={"Scan QR Code"}
        />
        <StatusBar backgroundColor={CONFIG.theme_color} /> 
        {(this.state.loading)? 
          <Content scrollEnabled={false}>
            {this._checkPlatform()}
          </Content>
          : <Loading/>}
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