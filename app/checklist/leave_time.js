import React,{Component} from 'react';
import {
  Content, 
  Spinner,
  Text,
  ListItem,
  Left,
  Body,
  Right,
  Icon
} from 'native-base';

import {View, Platform, TimePickerAndroid} from 'react-native';       
import CONFIG from '../config/config.js';
import IosTimePicker from '../components/ios_time_picker.js';
import THEME from '../config/theme';
import CommonStyles from '../config/commonStyle.js';

export default class LeaveTime extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      timePicker: false,
      checkout_time_disp: '',
      checkout_time: '1:15',
      ios_time_picker: false,
      initial_time: '1:15'
    };
  }
  
  async _openAndroidTimePicker(){
    try {
       let arr = this.state.checkout_time.split(":")
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: parseInt(arr[0]),
        minute: parseInt(arr[1]),
        is24Hour: false,
        mode: 'spinner'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        this._saveClickedAndroid(hour,minute)
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  padDigits(number, digits) {
    let number1 = parseInt(number);
    return Array(Math.max(digits - String(number1).length + 1, 0)).join(0) + number1;
  }

  _saveClickedAndroid(hour,minute){
    var format = (hour >= 12)? 'PM' : 'AM'
    var hours = (hour > 12)? hour-12 : hour
    hours = (hours == 0)? hours+12 : hours
    this.setState({
      checkout_time: hour+':'+minute, 
      checkout_time_disp: this.padDigits(hours, 2)+':'+this.padDigits(minute, 2)+' '+format
    })
    this.props.onLeaveTimeSave(this.padDigits(hour, 2)+':'+this.padDigits(minute, 2));
  }

  _validateTime = (hour, minute, total_hour) =>{
    if (this.state.ios_picker_for_hours_type == false){
      this.setState({call_to_duty_hour: total_hour, call_to_duty_hour_disp: hour+':'+minute})
    }else{
      var format = (total_hour > 13)? 'PM' : 'AM'
      // /var hour1 = (format == 'AM' && hour == 12) ? 0 : hour+12
      var new_hour;
      if (format == 'AM' && hour == 12){
        new_hour = 0;
      }else if(format == 'PM' && hour == 12){
        new_hour = 12
      }else if (format == 'PM' && total_hour > 13){
        new_hour = parseInt(hour)+12;
      }else{
        new_hour = hour;
      }
      console.log(hour,minute, total_hour, new_hour)
      this.setState({
        initial_time: hour+':'+minute, 
        checkout_time: new_hour+':'+minute, 
        checkout_time_disp: this.padDigits(hour, 2)+':'+this.padDigits(minute,2)+' '+format
      })
    }
    this.setState({ios_time_picker: false, hours:0, minute:15});
    this.props.onLeaveTimeSave(this.padDigits(new_hour, 2)+':'+this.padDigits(minute, 2));
  }

  _renderIosTimerPicker(){
    if (this.state.ios_time_picker) {
      let arr = this.state.initial_time.split(":")
      let amOrPm = this.state.checkout_time_disp.split(" ")
      return (
        <IosTimePicker 
          initialHour={arr[0]} 
          initialMinute={arr[1]} 
          initialFormat={(amOrPm.length>0)?amOrPm[1]:''} 
          ios_time_picker={this.state.ios_time_picker}
          cancelClicked={this._cancelPickerClicked}
          onTimeChange={this._validateTime}
          is24hour={true}
        />
      );
    }
    else return(
      <View/>
    )
  }

  _cancelPickerClicked = () => {
    this.setState({
      ios_time_picker:false
    })
  }

  _cancelClicked = () => {
    this.setState({
      timePicker:false
    })
  }

  _openTimePicker(){
    if(Platform.OS === 'ios'){
      this.setState({ios_time_picker: true});
    }
    else{
      this._openAndroidTimePicker();
    }
  }
  
  render() {
    return (
    <View>
      <ListItem icon onPress={()=> this._openTimePicker()}>
        <Left/>
        <Body>
        <Text style={{fontSize: 13}}><Icon name='md-time' style={{fontSize:13, marginRight:5}}/> {CONFIG.leaveTime}</Text>
        </Body>
        <Right>
          <Text note style={{color: CONFIG.theme_color}}>{this.state.checkout_time_disp}</Text>
        </Right>
      </ListItem>
      {this._renderIosTimerPicker()}
    </View>
    );
  }
}