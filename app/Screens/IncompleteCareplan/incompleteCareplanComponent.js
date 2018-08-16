import React,{Component} from 'react';
import {
  Content, 
  Spinner,
  Text,
  Container,
  Button,
} from 'native-base';

import {
  StatusBar,
  RefreshControl,
  Alert
} from 'react-native';

import Header from '../../components/back_header.js';     
import CONFIG from '../../config/config.js';
import CONSTANTS from '../../config/constants.js';
import ExtraActivity from '../../checklist/extra_activity.js';
import ListHeader from '../../checklist/list_header.js';
import Helper from '../../config/Helper.js';
import PermissionHelper from '../../config/permission_helper.js';
import Loading from '../../components/Loading.js';
import _ from 'lodash';
// import FCM from 'react-native-fcm';
import moment from 'moment-timezone';
import { StackActions,NavigationActions } from 'react-navigation';

const responseData = {
  call_to_duty_enabled:false,
  is_live_in_over:false,
  live_in_incomplete:false,
  live_in_questions:[],
  todos:[{category_name: "Custom CP 1", 
      todo_list: [
      {todo_id: 1, todo_name: "CP Task 1", todo_phrase: "Did u test this CP ?", status: "yes"},
      {todo_id: 139, todo_name: "Private CP TASK", todo_phrase: "DID YOU SERVE THIS?", status: "none"}]
      },
      {category_name: "Nutrition", 
      todo_list: [
      {todo_id: 1, todo_name: "Serve", todo_phrase: "Did you serve a meal?", status: "yes"},
      {todo_id: 139, todo_name: "Breakfast", todo_phrase: "Did the Client eat breakfast?", status: "none"},
      {todo_id: 1, todo_name: "Lunch", todo_phrase: "Did you serve a lunch?", status: "none"},
      {todo_id: 139, todo_name: "Dinner", todo_phrase: "Did the Client eat dinner?", status: "none"}
      ]
      }]
}


export default class IncompleteCheckList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      questions: [],
      disabled: false,
      loading: true,
      extra_milage: '',
      injury_status: '',
      refreshing: false,
      call_to_duty_hour: 0.0,
      call_to_duty_enabled: false,
      leave_time: '',
      mobile_battery: 0,
      mobile_location:false,
      longitude: '',
      latitude: '',
      live_in_incomplete: ''
      //For live in incomplete check from notification list tap on incomplete
    };
    this.responseData = [];
    this.questionResponseData = [];
    this.locationRetryCount = 0;
    this.locationPopupShown = false;
  }

  componentWillMount() {
    this._getAndSetLocation();
    this._getTodoList();
    console.log(this.props,"d--------")
  }

  _getAndSetLocation(resolve = null) {
    let permission = (this.props.location_permission === "while_in_use") ? "WhenInUse" : "Always"
    Helper.getCurrentLocation(permission,(location) => {
      console.log(location, "from method")
      this._setLocation(location.coords.longitude,location.coords.latitude,location.battery.level,true);
      if(resolve != null) {
        resolve();
      }
    },(error) => {
      console.log(error, "from error method")
      this._setLocation('','',0,false);
      if(resolve != null) {
        resolve();
      }
    });
  }

  componentDidMount(){
    // FCM.removeAllDeliveredNotifications();
  }

  _enableLocation(resolve = null) {
    PermissionHelper.askToEnableLocation(()=> {
      // Success code
      return resolve != null ? resolve() : 0;
    }, (error) => {
      console.log(error.message); 
    });
  }

  _setLocation(longitude, latitude, battery, mobile_location){
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

  _setParams(){
    if (this.props.visit_data.visit_type === 'Appointment'){
      return {appointment_id: this.props.visit_data.visit}
    }else{
      return {client_visit_id: this.props.visit_data.visit}
    }
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

  _questionTodoData = (todo_id, status, comment="") =>{
    this.questionResponseData = _.map(this.questionResponseData, function(todo) {
      return todo.todo_id === todo_id ? {"todo_id": todo_id, "status": status, "comment": comment} : {"todo_id": todo.todo_id, "status": todo.status, "comment": todo.comment || ""};
    });
    console.log(this.questionResponseData)
  }

  _makeFinalArray = () => {
    let arrToBeSend = _.flatMap(this.responseData, item =>
       _.map(item.todo_list, tag => _.defaults({ todo_list: item.todo_id }, tag))
    );
    this.responseData = arrToBeSend;
  }
  
  _confirmationForSubmit(){
    console.log(this.state.checkout_time, "checkout time")
    if (_.find(this.questionResponseData,{status:'none'}) !== undefined){
      this.header._alert({status: 'error', message: "Please answer the questions."});
    } else if (_.find(this.responseData,{status:'none'}) !== undefined){
      this.header._alert({status: 'error', message: "Please submit the all care plans."});
    } else if(this.state.leave_time === '' && !this.state.live_in_incomplete) {
      this.header._alert({status: 'error', message: "Please select leave time"});
    } else {
      Helper._alertPopupButtonCallBack(
        CONFIG.carePlanTitle,
        CONFIG.carePlanMessage,
        () => {
          console.log("cancel")
        },
        () => {
          this._sendTodoList()
        }
      )
    }
  }

  _handleFormSubmit() {
    this.setState({loading: true});
    new Promise ((resolve, reject) => {
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


  async _getTodoList(){
    this.setState({loading: true})
    this.responseData = responseData.todos;
    this.questionResponseData = []
    this._makeFinalArray();
    this.setState({
      questions: [],
      data: responseData.todos, 
      call_to_duty_enabled: false,
      live_in_incomplete: false,
      loading: false
    });
  }
  
  _backFromQrCode = () => {
    this._navigate('TabList', {});
  }

  async _sendTodoList(){
    this._navigate('TabList', {status: 'success', message: "Your checklist is submitted successfully!!"});
  }

  _onRefresh(){
    this.setState({refreshing: true});
    this._getTodoList().then(() => {
      this.setState({refreshing: false});
    });
  }

  _isLocationNotPresent(timer) {
    let isLocationNotPresent = Helper.isRssiAndLocationNotPresent(this.state.latitude, this.state.longitude);
    console.log("incomplete_plan._isLocationNotPresent = ", isLocationNotPresent);
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
              contentContainerStyle={Helper._containerStyleTask(Object.keys(this.state.data).length, this.props.show)}
            >
            {(this.props.show == null)? 
              <ExtraActivity 
                leaveTime={!this.state.live_in_incomplete}
                callToDuty={this.state.call_to_duty_enabled}
                saveData = {this._saveExtraActivityData}
              /> 
              : null }

              {(this.state.call_to_duty_enabled === true && this.questionResponseData.length > 0)?
              <ListHeader
                data={this.state.questions}
                saveTodoData = {this._questionTodoData}
                option = {true}
              />: null}
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
        {(!this.state.loading && this.props.show == null)?
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