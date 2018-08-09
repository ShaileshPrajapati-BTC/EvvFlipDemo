import React,{Component} from 'react';
import {
  Content,
  Spinner,
  Text
} from 'native-base';
import {
  Modal,
  View,
  Picker,
  PickerItemIOS
} from 'react-native';
import CONFIG from '../config/config.js';
import Helper from '../config/Helper.js';

export default class IosTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ios_time_picker: true,
      hours: props.initialHour || 1,
      minute: props.initialMinute || 15,
      format: props.initialFormat || 'AM'
    };
  }

  componentWillReceiveProps() {
    this.setState({ios_time_picker: this.props.ios_time_picker,hours: this.props.initialHour || 0,
      minute: this.props.initialMinute || 15,});
  }

  _is24HourFormat(){
    return (this.props.is24hour === true && this.props.is24hour !=null)
  }
  _validateTime = () => {

    if(this._is24HourFormat()){

      let format_hours = (this.state.format === 'AM') ? this.state.hours : this.state.hours + 12;
      let hours = Helper._timeToDecimal(format_hours, this.state.minute);
      console.log("date time",hours,format_hours,this.state.minute)
      this.props.onTimeChange(this.state.hours, this.state.minute, hours);
    }else{
      let hours = Helper._timeToDecimal(this.state.hours, this.state.minute);
      this.props.onTimeChange(this.state.hours, this.state.minute, hours);
    }

    this.setState({ios_time_picker: false})
  }


  _renederItem(number, count){
    let rows = [];
    for (let i = count; i < number; i++) {
      rows.push(<Picker.Item
        key={i.toString()}
        value={i}
        label={i.toString()}
      />);
    }
    return (rows);
  }

  render() {
    const time = (this._is24HourFormat())? {hour: 13, start:1} : {hour: 24, start:0}
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.ios_time_picker}
        onRequestClose={() => {}}
        style = {{backgroundColor: 'transparent'}}
      >
        <View style={{flex:1,justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <View style={{justifyContent: 'center', backgroundColor: 'white',marginLeft: 10, marginRight:10,padding:10,borderRadius: 10, height:300}}>

            <View style={{flex: 1,flexDirection: 'row', justifyContent:'center',marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>Hours</Text>
              <Text style={{fontWeight: 'bold',marginLeft: 15}}>Minute</Text>

            </View>
            <View style={{flexDirection: 'row',justifyContent: 'center'}}>
              <Picker
                style={{width: 50}}
                selectedValue={parseInt(this.state.hours)}
                onValueChange={(data) => this.setState({hours: data})}>
                {this._renederItem(time.hour,time.start)}
              </Picker>
              <Picker
                style={{width: 50}}
                selectedValue={parseInt(this.state.minute)}
                onValueChange={(data) => this.setState({minute: data})}>
                {this._renederItem(60,0)}
              </Picker>
              {(this._is24HourFormat()) ?
                <Picker
                  style={{width: 50}}
                  selectedValue={this.state.format}
                  onValueChange={(data) => this.setState({format: data})}>
                  <Picker
                    key={'AM'}
                    value={'AM'}
                    label={'AM'}
                  />
                  <Picker
                    key={'PM'}
                    value={'PM'}
                    label={'PM'}
                  />
                </Picker>: null}
            </View>

            <View style={{flex: 1,flexDirection: 'row', justifyContent:'center',marginTop: 10}}>
              <Text style={{fontWeight: 'bold', color: CONFIG.success_color}}
                    onPress={()=> {
                    this._validateTime()}}
              >
                Save
              </Text>
              <Text style={{fontWeight: 'bold',marginLeft: 25, color:CONFIG.error_color}}
                    onPress={()=> {
                      this.setState({ios_time_picker: !this.state.ios_time_picker, hours:0,minute:15 })
                      this.props.cancelClicked();
                    }
                    }
              >
                Cancel
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}