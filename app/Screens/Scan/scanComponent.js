import React, {Component} from 'react';
import {
  Badge,
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Spinner,
  Subtitle,
  Text,
  Thumbnail,
  Title
} from 'native-base';

import {Alert, Animated, RefreshControl, StatusBar, TouchableWithoutFeedback, View} from 'react-native';

import Pulse from '../../../lib/Pulse.js';
import CONFIG from '../../config/config.js';
import Helper from '../../config/Helper.js';
import PermissionHelper from '../../config/permission_helper.js';
import Loading from '../../components/Loading.js';
import Permissions from 'react-native-permissions';
import OpenAppSettings from 'react-native-app-settings'

let Status = ["N/A", "Incomplete"];

export default class ScanComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      disabled: false
    };
    this.springValue = new Animated.Value(0.3)
  }

  componentDidMount() {
    this.spring();
    console.log("sss12");
    this.props.getAppointmentStatus().then((res) => {
      this._enableTracking();
      if(this.props.in_out_status === 'Out'){
        this._enableBluetooth();
      }
    });
    this.props.StartLocation();
    //check tracking start or stop when restart app
  }

  componentWillMount() {
    console.log("----d-d-d-d-d-d-d-", this.props)
  }

  _enableBluetooth(resolve = null) {
    let self = this;
    PermissionHelper.askToEnableBluetooth(() => {
      // Success code
      self._enableLocation(() => {
        return resolve != null ? resolve() : 0;
      });
    }, (error) => {
      console.log(error.message);
    });
    this.setState({disabled: false})
  }

  _enableLocation(resolve = null) {
    PermissionHelper.askToEnableLocation(() => {
      // Success code
      return resolve != null ? resolve() : 0;
    }, (error) => {
      console.log(error.message);
    });
    this.setState({disabled: false})
  }

  spring() {
    this.springValue.setValue(0.9)
    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 1,
        duration: 3000
      }
    ).start(this.spring.bind(this))
  }

  // startBeaconTracking() {
  //   if (beaconTracking == null){
  //     console.log("tracking start")
  //     beaconTracking = setInterval(() => {
  //       this._sendTrackingData()
  //     },300000)
  //   }
  // }

  _navigate(name, show) {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     show: show
    //   }
    // });
    this.props._navigate(name, {show: show})
  }

  _enableTracking() {
    if (this.props.in_out_status === "Out") {
      this._checkPermission();
      this.props.StartBeacon(this.props.userData.uuid);
    } else {
      this.props.StopBeacon();
    }
  }

  // _stopTracking(){
  //   if (beaconTracking != null){
  //     clearInterval(beaconTracking);
  //     console.log("<<<<<<<<<<<<<<<<<<<<- Stoping Timer ->>>>>>>>>>>>>>>>")
  //     this.props.StopBeacon();
  //     beaconTracking == null
  //   }
  // }


  _checkTaskStatus() {
    if(this.props.userData.user_can_visit === true){
      this.setState({disabled: true}, ()=>{
        this._enableBluetooth(() => {
          this._checkPermission(() => {
              if (this.props.userData.user_type === true) {
                this._appointment_check_in_check_out();
              } else {
                this._navigate('Qrcode');
                this.setState({disabled: false});
              }
              this.props.fetchLocation();
            },
            () => {
              this.setState({disabled: false});
            }
          );
        });
      });
    }else{
      Helper._alertPopupWithOutCall("", CONFIG.notAbleToCheckIn)
    }

  }

  _isStateCheckOut() {
    return this.state.in_out_status === "Out";
  }

  _appointment_check_in_check_out() {
    if (this._isStateCheckOut()) {
      this._getAppointemntStatus(false, true);
    }
    else {
      this._getAppointemntStatus(true, true);
    }
  }

  _open_model_check_in_check_out() {
    if (this._isStateCheckOut()) {
      this._navigate('Task');
    } else {
      this._navigate('Qrcode');
    }
  }

  // call this method on load to check current appointment status checked out not from server.
  async _getAppointemntStatus(in_out_status = false, appointment_status = false) {
    console.log("_getAppointemntStatus ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", in_out_status, appointment_status)
    try {
      this.props.getAppointmentStatus()
        .then((responseData) => {
          console.log("appointment location")
          console.log(responseData);
          this.setState({disabled: false});
          if (responseData.status === true) {
            if (this.props.in_out_status === "In") {
              this.props.StopBeacon();
              this.props.SendTrackingReport([]);
              this._navigate('Qrcode');
            } else if (this.props.in_out_status === "Out") {
              this._enableTracking();
              if (this.props.userData.is_live_in_over === false) {
                this._navigate('Task');
              } else {
                this._navigate('Qrcode');
              }
              // this._navigate('Task');
            }
          }
        }).catch((error) => {
        this._checkAppointmentStatus(appointment_status)
        console.log(error, "---------->error in _getAppointemntStatus");
      });
    } catch (error) {
      console.log(error, "---------->error in _getAppointemntStatus");
      this.setState({disabled: false});
    }
  }

  _checkAppointmentStatus(appointment_status) {
    if (this.props.in_out_status === "Out") {
      this._navigate('Task');
    } else if (appointment_status) {
      this._navigate('Qrcode');
    }
    this.setState({disabled: false});
  }

  async _checkNextAppointment() {
    this.props.getNextAppointmentStatus()
      .then((responseData) => {
        console.log("----------------------->")
        console.log(responseData);
        if (responseData.status === true) {
          let data = responseData.data;
          Helper._alertPopupWithOutCall('Appointment Info', Helper.nextAppointmentInfo(data.date, data.utc_start_time, data.utc_end_time));
        } else if (responseData.status === false) {
          Helper._alertPopupWithOutCall('Appointment Info', responseData.message)
        }
      })
      .catch((error) => {
        Helper.apiResponseAlert(error, CONFIG.check_appointment_api_error_404);
        console.log(error, "===========> _checkNextAppointment");
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    if (this.props.userData.user_type === true) {
      this._checkNextAppointment().then(() => {
        this.setState({refreshing: false});
      });
    } else {
      this.setState({refreshing: false});
    }
  }

  _checkPermission(resolve, reject) {
    Permissions.getPermissionStatus('location')
      .then(response => {
        if (response !== 'authorized') {
          this._requestForPermissions(resolve, reject);
        } else {
          this.setState({loading: true});
          return resolve();
        }
      });
  }

  _requestForPermissions(resolve, reject) {
    Permissions.requestPermission('location')
      .then(response => {
        if (response !== 'authorized') {
          Alert.alert(
            'EVV would like to use Your Location.',
            "EVV use location for tracking, Please enable it from settings.",
            [
              {text: 'Cancel', style: 'cancel', onPress: this._cancel.bind(this)},
              {text: 'Open Settings', onPress: this._openSettings.bind(this)},
            ]
          )
          return reject();
        } else {
          if (response === 'authorized') {
            this.setState({loading: true});
            return resolve();
          } else {
            return reject();
          }
        }
      });
  }

  _openSettings() {
    OpenAppSettings.open();
    // this._navigate('TabList');
  }

  _cancel() {
    // this._navigate('TabList');
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={CONFIG.theme_color}/>
        {(!this.props.logoutLoader) ?
          <Content
            contentContainerStyle={{flex: 1}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, margin: 10}}>
                {(this.props.incomplete_count > 0 && this.props.userData.user_type === true) ?
                  <Animated.View style={{transform: [{scale: this.springValue}]}}>
                    <TouchableWithoutFeedback onPress={() => this._navigate('RemoteCheckoutList')}>
                      <Badge style={{borderRadius: 5, backgroundColor: '#ff9800', alignSelf: 'flex-start'}}>
                        <Text>{this.props.incomplete_count + " Visits require your attention"}</Text>
                      </Badge>
                    </TouchableWithoutFeedback>
                  </Animated.View> : <View/>}
                <Icon name="ios-radio" style={{color: this.props.beaconColor, fontSize: 25, alignSelf: 'flex-end'}}/>
              </View>
              <Card style={{flex: 0, justifyContent: 'flex-start'}}>
                <List>
                  <ListItem itemDivider>
                    <Text style={{color: CONFIG.theme_color, fontSize: 15, fontWeight: "bold"}}>Schedule
                      Information</Text>
                  </ListItem>
                  <ListItem icon>
                    <Left>
                      <Icon name="ios-person"/>
                    </Left>
                    <Body>
                    <Text style={{fontSize: 15}}>Client name</Text>
                    </Body>
                    <Right>
                      <Text style={{fontSize: 14}}>{this.props.userData.client_name}</Text>
                    </Right>
                  </ListItem>
                  <ListItem icon>
                    <Left>
                      <Icon name="ios-timer"/>
                    </Left>
                    <Body>
                    <Text style={{fontSize: 15}}>Status</Text>
                    </Body>
                    <Right style={{flexDirection: 'column'}}>
                      <Text style={{
                        fontSize: 14,
                        bottom: 2,
                        alignSelf: 'flex-end'
                      }}>{this.props.userData.scan_status}</Text>
                      {(Status.includes(this.props.userData.scan_status)) ? null :
                        <Text style={{fontSize: 13}}>{Helper.toTimeZone(this.props.userData.scan_time)}</Text>
                      }
                    </Right>
                  </ListItem>
                </List>
              </Card>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50, marginBottom: 50}}>
              <Pulse pulseSize={250}/>
              <Pulse pulseSize={200}/>
              <Button
                onPress={() => this._checkTaskStatus()}
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  backgroundColor: CONFIG.theme_color,
                  alignSelf: 'center',
                  width: 150,
                  height: 150,
                  borderRadius: 75
                }}
                disabled={this.state.disabled}
              >
                <Text
                  style={{alignSelf: 'center', fontSize: 15}}>{this.props.userData.clock_status.toUpperCase()}</Text>
              </Button>
            </View>
          </Content>
          : <Loading/>}
      </Container>
    );
  }
}