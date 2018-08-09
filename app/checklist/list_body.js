import React,{Component} from 'react';
import {
  Content, 
  Spinner,
  Text,
  Card,
  List,
  ListItem,
  Left,
  Right,
  Body
} from 'native-base';

import CONFIG from '../config/config.js';
import { SegmentedControls } from 'react-native-radio-buttons'
import Helper from '../config/Helper.js';
import CommentPopup from './commentPopup';

const options = [
  { label:'Yes', value: 'yes' },
  { label:'No', value: 'no'},
  { label:'Refused', value: 'refused' }
];
const question = [
  { label:'Yes', value: 'yes' },
  { label:'No', value: 'no'}
];
const seg_color = {
  'yes': "#00B325",
  'no': "#cc3232",
  'refused': "#cd853f",
  'none': "#757575"
}

export default class ListBody extends Component {

  constructor(props) {
    super(props);
    this.state = {
      picker_state: props.task.status || 'none',
      token: props.token || '',
      appointment_module: props.appointment_module || '',
      appointment_id: props.appointment_id || '',
      client_visit_id: props.client_visit_id || '',
      comment_popup: false,
      comment: props.task.comment || ""
    };
  }
  
  componentWillReceiveProps(){}

  onValueChange (value) {
    console.log(value, "dd")
    if (this.props.submitTask != null) {
      if (this.state.picker_state !== value.value) {
        let prev_value = this.state.picker_state;
        this._updateSingleTask(this.props.task.todo_id, value.value, prev_value)
      }
    } else {
      if (this.props.option !== null && this.props.option === true) {
        if (value.value === 'no') {
          this.setState({comment_popup: true})
        }else{
          this.setState({comment: ''})
        }
      }
      this.props.onChange(this.props.task.todo_id, value.value, "");
      this.setState({picker_state: value.value})
    }
  }
  _handleInput = (value) => {
    this.setState({comment_popup: false, comment: value});
    this.props.onChange(this.props.task.todo_id, this.state.picker_state, value);
  }

  async _updateSingleTask(todo_id, status, prev_value){
    this.setState({picker_state: status})
    this.props.showAlert.alertWithType("success", "Thank you!","CheckList Saved successfully!");

    // let location = {};
    // if (this.props.getLocationAndRssiValue != null){
    //   location = this.props.getLocationAndRssiValue()
    //   console.log(location, "location caaa")
    // }
    // let self = this;
    // let data = { task: {
    //                 todo_id: todo_id, 
    //                 status: status,
    //                 longitude: location.longitude || '',
    //                 latitude: location.latitude || '',
    //                 rssi_value: location.rssi_value || 0
    //               } 
    //            }
    // if (this.props.appointment_module === true){
    //   Object.assign(data, {appointment_id: this.props.appointment_id});
    // }else{
    //   Object.assign(data, {client_visit_id: this.props.client_visit_id});
    // }
    // let response = await fetch(CONFIG.BASE_URL+'/todolist/update_task', {
    //   method: 'PUT',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //     'access_token': this.state.token
    //   },
    //   body: JSON.stringify(data)
    // }).catch(function(error) {
    //   // Helper._alertPopup('', CONFIG.something_went_wrong);
    //   console.log("error insss send =============", error);
    // });
    // try {
    //   let res = await response.json();
    //   console.log(res);
    //   if (res.status === 404 || res.status === 500){
    //     Helper._alertPopup('', CONFIG.care_plan_submit_error);
    //   }else if (res.status === true){
    //     self.setState({picker_state: status})
    //     console.log(self.state.picker_state,"daaa")
    //     self.props.onChange(self.props.task.todo_id, status);
    //     this.props.showAlert.alertWithType("success", "Thank you!",res.message);
    //   }
    //   else{
    //     self.setState({picker_state: prev_value});
    //     self.props.showAlert.alertWithType("error", "", res.message);
    //   }
    // } catch(error) {
    //   Helper._alertPopup('', CONFIG.something_went_wrong);
    //   console.log("error in send =============", error);
    //   self.setState({picker_state: prev_value});
    // }
  }

  render() {
    let option = (this.props.option !== null) ? question : options
    return (
        <ListItem >
          <Body>
            <Text style={{fontSize: 14}}>{this.props.task.todo_name}</Text>
            <Text note style={{fontSize: 12, color: '#b2b2b2'}}>{this.props.task.todo_phrase}</Text>
          </Body>
          <Body/>
          {(this.props.showButton === false)?
            <Right/> :
            <Right>
              <SegmentedControls
                tint= {seg_color[this.state.picker_state]}
                selectedTint= {'white'}
                backTint= {'white'}
                allowFontScaling={false}
                optionStyle= {{
                  fontSize: 9,
                  fontWeight: 'bold',
                }}
                containerStyle= {{
                  width: 150,
                }}
                options={ option }
                onSelection={ this.onValueChange.bind(this) }
                selectedOption={option.find((x) => x.value === this.state.picker_state)}
                extractText={ (option) => option.label }
                testOptionEqual={ (a, b) => {
                  if (!a || !b) {
                    return false;
                  }
                  return a.label === b.label
                }}
              />
            </Right>}
          {(this.props.option !== null && this.props.option === true) ?
            <CommentPopup
              comment_popup={this.state.comment_popup}
              onSave={this._handleInput}
              answer={this.state.picker_state}
              comment={this.state.comment}/> :
            null}
        </ListItem>
    );
  }
}