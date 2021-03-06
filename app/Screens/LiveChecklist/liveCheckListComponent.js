import React, {Component} from 'react';
import {Button, Container, Content, Spinner, Text,} from 'native-base';

import {RefreshControl} from 'react-native';
import CONFIG from '../../config/config.js';
import ListHeader from '../../checklist/list_header.js';
import Helper from '../../config/Helper.js';
import Loading from '../../components/Loading.js';
import _ from 'lodash';
import PermissionHelper from '../../config/permission_helper.js';

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

export default class LiveCheckList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      disabled: false,
      loading: true,
      signature: false,
      refreshing: false,
      is_live_in_over: false,
      longitude: '',
      latitude: '',
      offline: false
    };
    this.responseData = [];
  }

  componentWillMount() {
    // this._getAndSetLocation();
    this._getTodoList();
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.fetchData === true){
      this._getTodoList();
      // this._getAndSetLocation();
    }
  }

  componentDidMount(){
  }

  componentWillUnmount(){
    console.log("unmount checklist -------");
    this.setState({disabled: false, loading: false});
  }
  
  _enableLocation(resolve = null) {
    PermissionHelper.askToEnableLocation(()=> {
      // Success code
      // this._getAndSetLocation();
      return resolve != null ? resolve() : 0;
    }, (error) => {
      // this._enableLocation()
      console.log(error.message); 
    });
  }

  _getAndSetLocation(resolve = null){
    let permission = (this.props.location_permission === "while_in_use") ? "WhenInUse" : "Always"
    Helper.getCurrentLocation(permission,(location) => {
      console.log(location, "from method")
      this._setLocation(location.coords.longitude,location.coords.latitude);
      if(resolve != null) {
        resolve();
      }
    },(error) => {
      console.log(error, "from error method")
      this._setLocation('','');
      if(resolve != null) {
        resolve();
      }
    });
  }

  _setLocation(longitude,latitude){
    this.setState({
      longitude: longitude,
      latitude: latitude
    },()=>{
      console.log("state---", this.state)
    });
  }

  _saveTodoData = (todo_id, status) => {
    this.responseData = _.map(this.responseData, function(todo) {
      return todo.todo_id === todo_id ? {"todo_id": todo_id, "status": status} : {"todo_id": todo.todo_id, "status": todo.status};
    });
  }

  _makeFinalArray = () => {
    let arrToBeSend = _.flatMap(this.responseData, item =>
       _.map(item.todo_list, tag => _.defaults({ todo_list: item.todo_id }, tag))
    );
    this.responseData = arrToBeSend;
  }

  async _getTodoList(id = this.props.userData.scheduling_id){
    this.setState({loading: true})
    this.responseData = responseData.todos;
    this._makeFinalArray();
    this.setState({
      data: responseData.todos,
      questions: [],
      loading: false,
      offline: false
    }); 
  }

  _onRefresh(){
    this.setState({refreshing: true});
    this._getTodoList().then(() => {
      this.setState({refreshing: false});
    });
  }
  
  _getLocationAndRssiValue = () =>{
    console.log("location info")
    return {
      longitude: this.state.longitude, 
      latitude: this.state.latitude, 
      rssi_value: this.props.rssiValue
    }
  }

  _isLocationNotPresent = () => {
    let isLocationNotPresent = Helper.isRssiAndLocationNotPresent(this.state.latitude, this.state.longitude);
    console.log("live_check_list._isLocationNotPresent = ", isLocationNotPresent);
    if(isLocationNotPresent){
      this._enableLocation()
      return true;
    }
    return false;
  }

  render() {
    return (
      <Container scrollEnabled={false}>
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
                  submitTask={true}
                  showAlert={this.props.showAlert || null}
                  longitude = {this.state.longitude}
                  latitude = {this.state.latitude}
                  rssi_value = {this.props.rssiValue}
                  showButton = {this.props.showButton}
                  getLocationAndRssiValue = {this._getLocationAndRssiValue}
                  isLocationNotPresent = {this._isLocationNotPresent}
                />
              )
            })}
            </Content>
        }
      </Container>
    );
  }
}