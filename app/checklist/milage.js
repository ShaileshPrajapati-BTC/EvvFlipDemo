import React,{Component} from 'react';
import {
  Content,
  Spinner,
  Text,
  Item,
  Input,
  Button
} from 'native-base';
import {
  Modal,
  View
} from 'react-native';
import CONFIG from '../config/config.js';
import Helper from '../config/Helper.js';

export default class MileagePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extra_milage: '',
    };
  }

  componentWillReceiveProps() {}

  _saveAndClosePopup(){
    // return callback
    this.props.onSave(this.state.extra_milage);
    this.setState({extra_milage: ''});
  }

  render() {
    return (
      <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.props.extra_milage_popup}
            onRequestClose={() => {}}
            style = {{backgroundColor: 'transparent'}}
          >
            <View style={{flex:1,justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <View style={{justifyContent: 'center', backgroundColor: 'white',marginLeft: 10, marginRight:10,padding:10,borderRadius: 10, height: 160}}>
                <Item regular style={{backgroundColor: '#EEEEEE'}}>
                  <Input multiline={true}
                         maxLength={3}
                         placeholder={CONFIG.enterMilage}
                         autoFocus = {true}
                         numberOfLines = {3}
                         style = {{height : 50}}
                         allowFontScaling={false}
                         keyboardType="numeric"
                         onChangeText={(text) => {this.setState({extra_milage: text})}}
                  />
                </Item>
                <Button
                  disabled={this.state.extra_milage.length <= 0}
                  style={{ marginTop: 15, justifyContent:'center',
                    backgroundColor: (this.state.extra_milage.length > 0)? CONFIG.theme_color : CONFIG.disabled_color, alignSelf: 'center',borderRadius:10, width:120}}
                  onPress={ () => this._saveAndClosePopup()}>
                  <Text>{CONFIG.milageBtn}</Text>
                </Button>
              </View>
            </View>
          </Modal>
    );
  }
}