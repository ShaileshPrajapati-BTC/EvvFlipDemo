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
import { NavigationActions } from "react-navigation";

import Header from '../../components/back_header.js';     
import CONFIG from '../../config/config.js';
import ExtraActivity from '../../checklist/extra_activity.js';
import ListHeader from '../../checklist/list_header.js';
import Helper from '../../config/Helper.js';
import Loading from '../../components/Loading.js';
import _ from 'lodash'


export default class LiveCheckList extends Component {

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
      offline: false
    };
    this.responseData = [];
    this.questionResponseData = [];
  }

  componentWillMount() {
    this._getTodoList();
  }

  componentWillReceiveProps(nextProps){}

  componentDidMount(){
    if(this.props.latitude === ""){
      console.log("Empty")
      this.props.fetchLocation();
    }
  }

  componentWillUnmount(){}
  
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

  _navigate(name, data) {
    data = (
      data === undefined ?
      {} : 
      Object.assign(data, {
        picker_state: data.picker_state,
        extra_milage: data.extra_milage,
        injury_status: data.injury_status,
        call_to_duty_hours: data.call_to_duty_hours
      })
    );
    const navigate = NavigationActions.navigate({
      routeName: name,
      params: data
    });
    this.props.navigation.dispatch(navigate);
  }

  async _getTodoList(id = this.props.userData.scheduling_id){
    this.setState({loading: true})
    let body;
    if (this.props.userData.appointment_module === true){
      body = {appointment_id: id}
    }else{
      body = {client_visit_id: id}
    }
    this.props.fetchLiveCheckList(body)
    .then((responseData) =>
    {
      console.log("-----------------------> live check")
      console.log(responseData);
      if(responseData.status === true){
        if(responseData.data.is_live_in_over === false){
          this.responseData = responseData.data.todos;
          this.questionResponseData = (responseData.data.call_to_duty_enabled === true)? responseData.data.live_in_questions[0]["todo_list"] : []
          this._makeFinalArray();
          this.setState({
            data: []
          }, ()=>{
            this.setState({
              data: responseData.data.todos,
              questions: responseData.data.live_in_questions[0] || [],
              signature: responseData.signature,
              call_to_duty_enabled: responseData.data.call_to_duty_enabled,
              loading: false,
              offline: false
            });  
          })
        }else{
          this._stopBeacon();
          this.setState({loading: false, is_live_in_over: responseData.data.is_live_in_over});
          if(responseData.data.scheduling_id !== ""){
            this._getTodoList(responseData.data.scheduling_id);
          }
        }
      }else if(responseData.status === false){
        this.setState({loading: false});
      }
    })
    .catch((error) => {
      Helper.apiResponseAlert(error, CONFIG.get_todo_list);
      this.setState({loading: false, offline: true});
      console.log(error, "===========>>>>>> get todo list")
    });
  }

  _confirmationForSubmit(){
    if (this.props.show == null && _.find(this.responseData,{status:'none'}) !== undefined){
      this.header._alert({status: 'error', message: "Please submit all the checklists."});
    }else if (_.find(this.questionResponseData,{status:'none'}) !== undefined){
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

  async _sendTodoList(){
    this.setState({disabled: true, loading: true});
    console.log(this.state.signature+"ddddddddddd");
    if (this.state.signature){
      this._navigate('SignatureCapture', {
        picker_state: this.responseData,
        extra_milage: this.state.extra_milage,
        injury_status: this.state.injury_status,
        call_to_duty_hours: this.state.call_to_duty_hour,
        questions: this.questionResponseData
      });
    }else{
      this._navigate('Qrcode', {
        picker_state: this.responseData,
        extra_milage: this.state.extra_milage,
        injury_status: this.state.injury_status,
        call_to_duty_hours: this.state.call_to_duty_hour,
        questions: this.questionResponseData
      });
    }
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
          title = {this.props.userData.fullname}
          />
        <StatusBar backgroundColor= {CONFIG.theme_color} />
          { (this.state.loading) ? <Loading/> : 
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }
              contentContainerStyle={Helper._containerStyleTask(Object.keys(this.state.data).length, this.props.show)}
            >
            {(Object.keys(this.state.data).length > 0) ?
              null :
              <Text style={{marginLeft: 2,marginRight:2, marginTop:10, textAlign: 'center', color: CONFIG.theme_color}}>
                {(this.state.is_live_in_over)? 
                  CONFIG.live_in_submitted_careplan: 
                  (this.state.offline === true)? CONFIG.something_went_wrong:CONFIG.submitted_careplan}
              </Text>
            }
            {(this.props.show == null)? 
              <ExtraActivity 
                leaveTime={false} 
                callToDuty={this.state.call_to_duty_enabled}
                saveData = {this._saveExtraActivityData}
                callOffice = {true}
              /> 
              : null }
              {(this.state.call_to_duty_enabled === true && this.questionResponseData.length > 0)?
                <ListHeader
                  data={this.state.questions}
                  saveTodoData = {this._questionTodoData}
                  option = {true}
                />: null}
            {this.state.data.map((task_data,index) => {
              return(
                <ListHeader
                  key ={"header"+index}
                  data={task_data}
                  saveTodoData = {this._saveTodoData}
                  token = {this.props.userData.token}
                  appointment_module = {this.props.userData.appointment_module}
                  appointment_id = {this.props.userData.scheduling_id}
                  client_visit_id = {this.props.userData.scheduling_id}
                  submitTask={this.props.show || null}
                  showAlert={this.props.showAlert || null}
                  longitude = {null}
                  latitude = {null}
                  rssi_value = {0}
                  showButton = {this.props.showButton}
                />
              )
            })}
            </Content>
        }
        {(!this.state.loading)?
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