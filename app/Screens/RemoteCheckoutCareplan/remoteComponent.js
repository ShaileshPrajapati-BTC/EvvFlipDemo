import React, {Component} from 'react';
import {Button, Container, Content, Spinner, Text,} from 'native-base';

import {Alert, AsyncStorage, RefreshControl, StatusBar} from 'react-native';
import Header from '../../components/back_header.js';
import CONFIG from '../../config/config.js';
import CONSTANTS from '../../config/constants.js';
import ExtraActivity from '../../checklist/extra_activity.js';
import ListHeader from '../../checklist/list_header.js';
import Helper from '../../config/Helper.js';
import PermissionHelper from '../../config/permission_helper.js';
import Nodata from '../../components/no_data.js';
import Loading from '../../components/Loading.js';
import _ from 'lodash'
import FCM from 'react-native-fcm';
import moment from 'moment-timezone';
import { NavigationActions } from 'react-navigation';

export default class RemoteCheckoutCareplan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      disabled: false,
      loading: true,
      extra_milage: '',
      injury_status: '',
      signature: false,
      refreshing: false,
      call_to_duty_hour: 0.0,
      call_to_duty_enabled: false,
      leave_time: '',
      mobile_battery: 0,
      mobile_location:false,
      longitude: '',
      latitude: '',
      already_submitted: false,
      message: ''
    };
    this.responseData = [];
    this.locationRetryCount = 0;
    this.locationPopupShown = false
  }

  componentWillMount() {
    this._getTodoList();
  }

  _getAndSetLocation(resolve = null) {
    let permission = (this.props.location_permission === "while_in_use") ? "WhenInUse" : "Always"
    Helper.getCurrentLocation(permission,(location) => {
      console.log(location, "from method")
      this._setLocation(location.coords.longitude,location.coords.latitude,location.battery.level,true);
      if(resolve != null) {
        resolve();
      }
    },(error) =>{
      console.log(error, "from error method")
      this._setLocation('','',0,false);
      if(resolve != null) {
        resolve();
      }
    });
  }

  componentDidMount(){
    FCM.removeAllDeliveredNotifications();
  }

  _enableLocation(resolve = null) {
    PermissionHelper.askToEnableLocation(()=> {
      // Success code
      return resolve != null ? resolve() : 0;
    }, (error) => {
      console.log(error.message); 
    });
  }

  _setLocation(longitude,latitude,battery,mobile_location){
    this.setState({
      longitude: longitude,
      latitude: latitude,
      mobile_battery: battery,
      mobile_location: mobile_location
    },()=>{
      console.log("state---", this.state)
    });
  }

  _navigate(name, msg_obj) {
    console.log(msg_obj, "message")
    // this.props.navigator.resetTo({
    //   name: name,
    //   passProps: {
    //     msg: msg_obj
    //   }
    // })
    const resetAction = NavigationActions.reset({
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

  _setUrl(){
    let url;
    if (this.props.visit_data.visit_type === 'Appointment'){
      url = CONFIG.BASE_URL+'remote_checkout/new?appointment_id='+this.props.visit_data.visit
    }else{
      url = CONFIG.BASE_URL+'remote_checkout/new?client_visit_id='+this.props.visit_data.visit
    }
    return (url)
  }

  _saveExtraActivityData = (injury_status, extra_milage, leave_time, call_to_duty_hours) =>{
    console.log(injury_status, extra_milage, leave_time, call_to_duty_hours, "------->")
    this.setState({
      injury_status: injury_status,
      extra_milage: extra_milage,
      leave_time: leave_time,
      call_to_duty_hour: call_to_duty_hours
    })
  }

  _saveTodoData = (todo_id, status) => {
    this.responseData = _.map(this.responseData, function(todo) {
      return todo.todo_id === todo_id ? {"todo_id": todo_id, "status": status} : {"todo_id": todo.todo_id, "status": todo.status};
    });
    console.log(this.responseData)
  }

  _makeFinalArray = () => {
    let arrToBeSend = _.flatMap(this.responseData, item =>
       _.map(item.todo_list, tag => _.defaults({ todo_list: item.todo_id }, tag))
    );
    this.responseData = arrToBeSend;
  }
  
  _confirmationForSubmit(){
    this._enableLocation(() => {
      console.log(this.state.checkout_time, "checkout time")
      if (_.find(this.responseData,{status:'none'}) !== undefined){
        this.header._alert({status: 'error', message: "Please submit the all care plans."});
      } else if(this.state.leave_time === '') {
        this.header._alert({status: 'error', message: "Please select leave time"});
      } else {
        Helper._alertPopupButtonCallBack(
          CONFIG.carePlanTitle,
          CONFIG.carePlanMessage,
          () => {
            console.log("cancel")
          },
          () => {
            this._handleFormSubmit()
          }
        )
      }
    });
  }

  _handleFormSubmit() {
    this.setState({loading: true});
    new Promise((resolve, reject) => {
      this._getAndSetLocation(resolve);
    }).then(() => {
      let myTimer = setInterval(() => {
        
        if(this._isLocationNotPresent(myTimer)) {
          return;
        }

        clearInterval(myTimer);
        return this._sendTodoList();
      }, 1200);
    });
  }

  async _getTodoList(options={}){
    let stateOptions = options;
    let body;
    if (this.props.userData.appointment_module === true){
      body = {appointment_id: this.props.userData.scheduling_id}
    }else{
      body = {client_visit_id: this.props.userData.scheduling_id}
    }
    
    this.props.fetchRemoteChcekoutCareplan(body)
    .then((responseData) =>
    {
      console.log(responseData);
      if(responseData.status === true){
        this.responseData = responseData.data.todos;
        this._makeFinalArray();
        Object.assign(stateOptions, {
          data: responseData.data.todos, 
          signature: responseData.signature,
          call_to_duty_enabled: responseData.data.call_to_duty_enabled,
          loading: false, 
          already_submitted: false
        });
        this.setState(stateOptions);
      }else if(responseData.status === false){
        Object.assign(stateOptions, {loading: false, already_submitted: true, message: responseData.message});
        this.setState(stateOptions);
      }
    })
    .catch((error) => {
      Helper.apiResponseAlert(error, CONFIG.get_todo_list);
      this.setState({loading: false, refreshing: false});
      console.log(error, "===========>>>>>> get todo list")
    });
  }
  
  _backFromQrCode = () => {
    this._navigate('TabList', {});
  }

  async _sendTodoList(){
    var self = this;
    this.setState({disabled: true, loading: true});
    let leave_time = Helper.convertDateToUtc(moment().format("YYYY-MM-DD")+' '+this.state.leave_time);
    let data = {
      todo_list: this.responseData,
      extra_milage: this.state.extra_milage,
      injury_status: this.state.injury_status,
      actual_end_time: leave_time,
      call_to_duty_hours: this.state.call_to_duty_hour,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      mobile_location: this.state.mobile_location,
      mobile_battery: this.state.mobile_battery
    }
    let params;
    if (this.props.userData.appointment_module === true){
      params = Object.assign(data, {appointment_id: this.props.userData.scheduling_id});
    }else{
      params = Object.assign(data, {client_visit_id: this.props.userData.scheduling_id});
    }

    this.props.submitRemoteCheckoutCareplan(params)
    .then((res) => {
      if (res.status === true){
        AsyncStorage.setItem("appointment_status_call", "true");
        this._navigate('TabList', {status: 'success', message: res.message});
      }
      else{
        this.header._alert({status: 'error', message: res.message});
        this.setState({disabled: false, loading: false});
      }
    })
    .catch((error) => {
      Helper.apiResponseAlert(error, CONFIG.care_plan_submit_error);
      this._backFromQrCode();
      this.setState({disabled: false, loading: false});
      this._makeFinalArray();
      console.log("error insss send =============", error);
    });
  }
  _onRefresh(){
    this.setState({refreshing: true});
    this._getTodoList({refreshing: false}).then(() => {
      // this.setState({refreshing: false});
    });
  }

  _isLocationNotPresent(timer) {
    let isLocationNotPresent = Helper.isRssiAndLocationNotPresent(this.state.latitude, this.state.longitude);
    console.log("remote_checkout_careplan._isLocationNotPresent = ", isLocationNotPresent);
    if(isLocationNotPresent && this.locationRetryCount < CONSTANTS.location_and_rssi_wait_retry_count) {
      this.locationRetryCount+=1;
      return true;
    } else if(isLocationNotPresent){ //If RSSI OR location, any of them is not present then show alert message to try again.
      if(!this.locationPopupShown) {
        clearInterval(timer);
        this.locationPopupShown = true;
        Helper._alertPopupWithCallback('', CONFIG.location_rssi_unavailable_message, this._backFromQrCode);
      }
      return true;
    } 
    return false;
  }

  render() {
    return (
      <Container scrollEnabled={false}>
        <Header 
          navigator={this.props.navigation}
          ref={(header) => { this.header = header; }} 
          careplan={true}
          title = {this.props.userData.fullname}
        />
        <StatusBar backgroundColor= {CONFIG.theme_color} />
          {(this.state.loading)? <Loading/> :
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }
              contentContainerStyle={Helper._containerStyleTask(Object.keys(this.state.data).length, this.state.already_submitted || this.props.show)}
            >
            {(this.props.show == null && this.state.already_submitted===false)?
              <ExtraActivity 
                leaveTime={true} 
                callToDuty={this.state.call_to_duty_enabled}
                saveData = {this._saveExtraActivityData}
              /> 
              : <Nodata message={this.state.message}/> }
            {this.state.data.map((task_data) => {
              return(
                <ListHeader 
                  data={task_data}
                  saveTodoData = {this._saveTodoData}
                />
              )
            })}
            </Content>
        }
        {(!this.state.loading && this.props.show == null && this.state.already_submitted===false)?
          <Button 
            style={{justifyContent:'center', backgroundColor: CONFIG.theme_color, alignSelf: 'center', marginTop: 30, marginBottom: 20,width:150, borderRadius:10}} 
            onPress={ () => this._confirmationForSubmit() }
          >
            {(this.state.disabled)? <Spinner color='#ffffff'/> : <Text>SUBMIT</Text>}
          </Button>: <Text/>}
      </Container>
    );
  }
}