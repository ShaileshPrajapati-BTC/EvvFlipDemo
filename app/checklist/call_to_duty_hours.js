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

import {View} from 'react-native';       
import CONFIG from '../config/config.js';
import TimePicker from '../components/time_picker.js';

export default class CallToDutyHour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timePicker: false,
      call_to_duty_hour_disp: '',
      call_to_duty_hour: 0.0
    };
  }

  _onSaveClick = (hour, minute, total_hour) => {
    this.setState({call_to_duty_hour: total_hour, call_to_duty_hour_disp: hour+':'+minute, timePicker: false})
    this.props.onCallToDutySave(total_hour);
  }

  _cancelClicked = () => {
    this.setState({
      timePicker:false
    })
  }

  _renderTimePicker(){
    if(this.state.timePicker) {
      let array = this.state.call_to_duty_hour_disp.split(':')
      return (
        <TimePicker
          initialHour={(array.length>1)?array[0]:null}
          initialMinute={(array.length>1)?array[1]:null}
          title={"Enter total call to duty hours"}
          cancelClicked={this._cancelClicked}
          ios_time_picker={this.state.timePicker}
          onTimeChange={this._onSaveClick}
        />
      )
    }
    else return(
      <View/>
    )
  }

  render() {
    return (
      <View>
        <ListItem icon onPress={()=> this.setState({timePicker:true})}>
          <Left/>
          <Body>
          <Text style={{fontSize: 13}}>
            <Icon name='md-time' style={{fontSize:13, marginRight:5}}/> Call to duty hours</Text>
          </Body>
          <Right>
            <Text note style={{color: CONFIG.theme_color}}>{(this.state.call_to_duty_hour_disp!=":")?this.state.call_to_duty_hour_disp:''}</Text>
          </Right>
        </ListItem>
        {this._renderTimePicker()}
      </View>
    );
  }
}