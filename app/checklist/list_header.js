import React,{Component} from 'react';
import {
  Content, 
  Spinner,
  Text,
  Card,
  List,
  ListItem
} from 'native-base';

import {View} from 'react-native';       
import CONFIG from '../config/config.js';
import ListBody from './list_body.js';
import THEME from '../config/theme';

export default class ListHeader extends Component {
  _handleTaskResponse = (todo_id, status, comment="") => {
    console.log(status,"leeeeee")
    this.props.saveTodoData(todo_id, status, comment)
  }
  render() {
    return (
        <Card style={{borderBottomWidth:5, flexWrap: 'nowrap'}} bordered={true}>
          <List>
            <ListItem itemDivider style={{backgroundColor: THEME.scanInfoHeader}}>
              <Text style={{ fontSize: 15, fontWeight: "bold"}}>
              {this.props.data.category_name}
              </Text>
            </ListItem>
            {
              this.props.data.todo_list.map((task,index) =>{
                return(
                  <ListBody
                    key ={"body"+index}
                    task={task}
                    onChange = {this._handleTaskResponse}
                    option = {this.props.option || null}
                    token={this.props.token}
                    appointment_module = {this.props.appointment_module}
                    appointment_id = {this.props.appointment_id}
                    client_visit_id = {this.props.client_visit_id}
                    submitTask = {this.props.submitTask}
                    showAlert = {this.props.showAlert}
                    longitude = {this.props.longitude || ''}
                    latitude = {this.props.latitude || ''}
                    rssi_value = {this.props.rssi_value || 0}
                    showButton = {this.props.showButton}
                    getLocationAndRssiValue = {this.props.getLocationAndRssiValue || null}
                    isLocationNotPresent = {this.props.isLocationNotPresent || null}
                  />)
              })
            }
          </List>
        </Card>
    );
  }
}