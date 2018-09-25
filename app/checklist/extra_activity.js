import React, {Component} from 'react';
import {Body, Card, Content, Icon, Left, List, ListItem, Right, Spinner, Switch, Text} from 'native-base';

import {Alert, Linking} from 'react-native';
import CONFIG from '../config/config.js';
import MileagePopup from './milage.js';
import LeaveTime from './leave_time.js';
import CallToDutyHour from './call_to_duty_hours.js';
import THEME from '../config/theme';
import CommonStyles from '../config/commonStyle.js';

export default class ExtraActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      injury_status_switch: false,
      extra_milage_switch: false,
      call_to_duty_enabled: props.callToDuty || false,
      timePicker: false,
      ios_time_picker: false,
      injury_status: '',
      extra_milage_popup: false,
      extra_milage: '',
      what_time_did_you_leave: props.leaveTime || false,
      leave_time: '',
      call_to_duty_hours: '',
      call_office: props.callOffice || false
    };
  }
  _showInjuryPopup(value){
    if (value){
      this._alertPopup("", CONFIG.callOffice);
      this.setState({injury_status: 'yes'},()=>{
        this.props.saveData(this.state.injury_status,this.state.extra_milage, this.state.leave_time, this.state.call_to_duty_hours);
      });
    }else{
      this.setState({injury_status: ''}, ()=>{
        this.props.saveData(this.state.injury_status, this.state.extra_milage, this.state.leave_time, this.state.call_to_duty_hours);
      });
    }
    this.setState({injury_status_switch: value});
  }

  _showPopup(value){
    console.log(value, "dsdsds----")
   if (value === true){
      this.setState({extra_milage_popup: true, extra_milage_switch: value});
    }else{
      this.setState({extra_milage_switch: value, extra_milage: ''}, ()=>{
        this.props.saveData(this.state.injury_status, this.state.extra_milage, this.state.leave_time, this.state.call_to_duty_hours);
      });
    }
  }

  _alertPopup(title, msg){
    Alert.alert(
      title,
      msg,
      [
        { text: 'OK', 
          onPress: () => (this.state.call_office == true)? Linking.openURL('tel:844-302-3645'): console.log("no"), 
          style: 'cancel'
        },
      ],
      { cancelable: false }
    )
  }
  
  _handleInput = (value) => {
    console.log(value, "--------")
    this.setState({extra_milage_popup: false, extra_milage: value},()=>{
      this.props.saveData(this.state.injury_status, this.state.extra_milage, this.state.leave_time, this.state.call_to_duty_hours);
    });
  }

  _handleLeaveTime = (value) => {
    console.log("leave time ----", value);
    this.setState({leave_time: value}, ()=>{
      this.props.saveData(this.state.injury_status, this.state.extra_milage, this.state.leave_time, this.state.call_to_duty_hours);
    });
  }
  
  _handleCallToDutyHour = (value) => {
    console.log("call to duty hours----", value);
    this.setState({call_to_duty_hours: value}, ()=>{
      this.props.saveData(this.state.injury_status, this.state.extra_milage, this.state.leave_time, this.state.call_to_duty_hours);
    });
  }

  render() {
    return (
       <Card style={{flexWrap: 'nowrap'}}>
          <List>
            <ListItem itemDivider >
              <Text style={{color: THEME.themeColor, fontSize: 15, fontWeight: "bold"}}>{CONFIG.etcActivity}</Text>
            </ListItem>
            <ListItem icon>
              <Left/>
              <Body>
              <Text style={{fontSize: 13}}>{CONFIG.injuryToClinet}</Text>
              </Body>
              <Right>
                <Switch onValueChange = {this._showInjuryPopup.bind(this)} value = {this.state.injury_status_switch}/>
              </Right>
            </ListItem>
            <ListItem icon>
              <Left/>
              <Body>
              <Text style={{fontSize: 13}}>{CONFIG.milage}</Text>
              </Body>
              <Right>
                <Switch onValueChange = {this._showPopup.bind(this)} value = {this.state.extra_milage_switch} />
              </Right>
            </ListItem>
            {(this.state.what_time_did_you_leave == true)?
              <LeaveTime onLeaveTimeSave = {this._handleLeaveTime}/>:null}
            {(this.state.call_to_duty_enabled == true) ?
              <CallToDutyHour onCallToDutySave = {this._handleCallToDutyHour} />:null}
          </List>
          <MileagePopup extra_milage_popup={this.state.extra_milage_popup} onSave={this._handleInput}/>
        </Card>
    );
  }
}