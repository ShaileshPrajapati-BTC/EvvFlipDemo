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
  Alert,
} from 'react-native';
import Header from '../../components/back_header.js';     
import CONFIG from '../../config/config.js';
import ExtraActivity from '../../checklist/extra_activity.js';
import ListHeader from '../../checklist/list_header.js';
import Helper from '../../config/Helper.js';
import Loading from '../../components/Loading.js';
import _ from 'lodash';
import FCM from 'react-native-fcm';
import { NavigationActions } from 'react-navigation';

export default class LiveInChecklist extends Component {

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
      is_live_in_over: false,
      leave_time: '',
      mobile_battery: 0,
      mobile_location:false,
      longitude: '',
      latitude: '',
      rssi_value: 0
    };
    this.responseData = [];
    this.questionResponseData = [];
  }

  componentWillMount() {
    let permission = (this.props.location_permission === "while_in_use") ? "WhenInUse" : "Always";
    Helper.getCurrentLocation(permission, (location) => {
      console.log(location, "from method")
      this._setLocation(location.coords.longitude,location.coords.latitude,location.battery.level,true)
    },function(error){
      console.log(error, "from error method")
      this._setLocation('','',0,false)
    });
    this._getTodoList();
  }

  componentDidMount(){
    FCM.removeAllDeliveredNotifications();
  }
  
  componentWillUnmount(){
    console.log("unmount -------")
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
    if (_.find(this.responseData,{status:'none'}) !== undefined){
      this.header._alert({status: 'error', message: "Please submit the all care plans."});
    } else if (_.find(this.questionResponseData,{status:'none'}) !== undefined){
      this.header._alert({status: 'error', message: "Please answer the questions."});
    }
    else{
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

  async _getTodoList(){
    let body = {client_visit_id: this.props.visit_data.visit};
    this.props.fetchLiveInCareplan(body)
    .then((responseData) =>
    {
      console.log("----------------------->")
      console.log(responseData);
      if(responseData.status === true){
        let question = responseData.data.live_in_questions
        this.responseData = responseData.data.todos;
        this.questionResponseData = (question === undefined) ? [] : question[0]["todo_list"]
        this._makeFinalArray();
        this.setState({
          data: responseData.data.todos,
          questions: question === undefined ? [] : question[0],
          call_to_duty_enabled: responseData.data.call_to_duty_enabled
        });
      }
      this.setState({loading: false});
    })
    .catch((error) => {
      Helper.apiResponseAlert(error, CONFIG.get_todo_list);
      this.setState({loading: false});
      console.log(error, "===========>>>>>> get todo list")
    });
  }
  
  _backFromQrCode(){
    this._navigate('TabList', {});
  }

  async _sendTodoList(){
    this.setState({disabled: true, loading: true});
    let body = {
      todo_list: this.responseData,
      live_in_questions: this.questionResponseData,
      extra_milage: this.state.extra_milage,
      injury_status: this.state.injury_status,
      actual_end_time: this.state.leave_time,
      call_to_duty_hours: this.state.call_to_duty_hour,
      client_visit_id: this.props.visit_data.visit,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      rssi_value: this.props.rssiValue,
      mobile_location: this.state.mobile_location,
      mobile_battery: this.state.mobile_battery
    }
    console.log("params", body)
    this.props.submitLiveInCareplan(body)
    .then((res) => {
      console.log(res);
      if (res.status === true){
        this._navigate('TabList', {status: 'success', message: res.message});
      }
      else{
        this.header._alert({status: 'error', message: res.message});
        this.setState({disabled: false, loading: false});
      }
    }).catch((error) => {
      Helper.apiResponseAlert(error, CONFIG.care_plan_submit_error);
      this._backFromQrCode();
      this.setState({disabled: false, loading: false});
    })
  }

  _onRefresh(){
    this.setState({refreshing: true});
    this._getTodoList().then(() => {
      this.setState({refreshing: false});
    });
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
                leaveTime={false} 
                callToDuty={this.state.call_to_duty_enabled}
                saveData = {this._saveExtraActivityData}
              /> 
              : null }
              {(this.questionResponseData.length > 0)?
              <ListHeader
                data={this.state.questions}
                saveTodoData={this._questionTodoData}
                option={true}
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