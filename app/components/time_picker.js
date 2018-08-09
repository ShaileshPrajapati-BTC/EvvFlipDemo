import React, {Component} from 'react';
import {Button, Content, Form, Input, Item, Spinner, Text} from 'native-base';
import {Modal, PickerItemIOS, View} from 'react-native';
import CONFIG from '../config/config.js';
import Helper from '../config/Helper.js';

export default class IosTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ios_time_picker: true,
      hours: props.initialHour || '',
      minute: props.initialMinute || '',
      disabled:true
    };
  }

  componentWillReceiveProps() {
    this.setState({ios_time_picker: this.props.ios_time_picker});
  }

  _setButtonPress () {
    let hour = (this.state.hours!=='')?this.state.hours:0;
    let minute=(this.state.minute!=='')?this.state.minute:0
    if(!(hour === 0 && minute === 0)){
      if(parseInt(hour) > 0 || parseInt(minute) > 0) {
        this.setState({disabled:false})
      } else {
        this.setState({disabled:true})
      }
    } else {
      this.setState({disabled:true})
    }

  }

  _validateHours = (text) => {
    if(text<=23){
      this.setState({hours:text},()=>{
        this._setButtonPress();
      })
    }

  }

  _validateMinute = (text) => {
    if(text<=59){
      this.setState({minute:text},()=>{
        this._setButtonPress();
      })
    }

  }
  _saveClicked = () => {

    this.setState({
      hours:(this.state.hours!=='')?this.state.hours:0,
      minute:(this.state.minute!=='')?this.state.minute:0
    },()=>{

      var hours = Helper._timeToDecimal(this.state.hours, this.state.minute);
      console.log(hours);
      this.props.onTimeChange(this.state.hours, this.state.minute, hours);
    })


  }
  _clearClicked = () => {
    let hours = Helper._timeToDecimal('', '');
    this.props.onTimeChange('', '', hours);
    this.setState({ios_time_picker: !this.state.ios_time_picker, hours:'',minute:'' })
    this.props.cancelClicked();
  }

  // _confirmation_for_save = () => {
  //   Helper._notificationAlert("", this._saveClicked);
  // }

  render() {

    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.ios_time_picker}
        onRequestClose={() => {}}
        style = {{backgroundColor: 'transparent'}}
      >
        <View style={{flex:1,justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <View style={{justifyContent: 'center', backgroundColor: 'white',marginLeft: 20, marginRight:20,padding:10,borderRadius: 10, height:180}}>
            <Text style={{textAlign:'center'}}>{this.props.title}</Text>
            <Form style={{flex:1,justifyContent: 'center'}}>
              <View style={{flexDirection:'row',justifyContent: 'center',paddingBottom:5}}>
                <Text style={{fontWeight: 'bold',textAlign:'center',width:80}}>HH</Text>
                <Text style={{textAlign:'right',fontWeight: 'bold',width:20}}>:</Text>
                <Text style={{fontWeight: 'bold',textAlign:'center',width:80,paddingLeft:30}}>MM</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent: 'center'}}>
                <Item style={{borderColor: "#b5b3b3",height:30,borderWidth: 1, borderRadius:5,marginBottom:10,width:80}} >
                  <Input
                    maxLength={2}
                    placeholder='[0-23]'
                    placeholderTextColor="#b5b3b3"
                    style={{fontSize: 17,textAlign:'center'}} keyboardType="numeric"
                    autoFocus = {false}
                    value = {this.state.hours.toString()}
                    onChangeText={(text) => {this._validateHours(text)}}/>
                </Item>
                <Text style={{textAlign:'center',fontWeight: 'bold',width:10}}></Text>
                <Item style={{borderColor: "#b5b3b3",height:30,borderWidth: 1, borderRadius:5,marginBottom:10,width:80}} >
                  <Input
                    maxLength={2}
                    placeholder='[0-59]'
                    placeholderTextColor="#b5b3b3"
                    style={{fontSize: 17,textAlign:'center'}} keyboardType="numeric"
                    autoFocus = {false}
                    value = {this.state.minute.toString()}
                    onChangeText={(text) => {this._validateMinute(text)}}/>
                </Item>
              </View>

            </Form>
            <View style={{flexDirection: 'row', justifyContent:'center',marginTop: 0,marginLeft:10}}>
              <Button
                onPress={()=> {this._saveClicked()}} disabled={this.state.disabled}
                style={{backgroundColor:'transparent',borderWidth:0,shadowOffset: { height: 0, width: 0 },shadowOpacity: 0,elevation:0}}
              >
                <Text style={{fontWeight: 'bold', color: CONFIG.success_color}}>
                  Save
                </Text>
              </Button>
              {(!this.props.isFromNotification)?<Button
                onPress={()=> {this._clearClicked()}}
                style={{backgroundColor:'transparent',borderWidth:0,shadowOffset: { height: 0, width: 0 },shadowOpacity: 0,elevation:0}}
              >
                <Text style={{fontWeight: 'bold', color: CONFIG.theme_color}}>
                  Clear
                </Text>
              </Button>:null}
              <Button onPress={()=> {
                this.setState({ios_time_picker: !this.state.ios_time_picker })
                this.props.cancelClicked();
              }}
                      style={{backgroundColor:'transparent',borderWidth:0,shadowOffset: { height: 0, width: 0 },
                        shadowOpacity: 0,
                        elevation:0}}>
                <Text style={{fontWeight: 'bold',color:CONFIG.error_color}}>
                  Cancel
                </Text>
              </Button>
            </View>
          </View>
        </View>


      </Modal>
    );
  }
}