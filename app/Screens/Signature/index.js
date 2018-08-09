import React,{Component} from 'react';
import {
  Container,
  Content,
  Spinner,
  Button,
  Badge,Icon
} from 'native-base';
import  {
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  View,
  Platform
} from 'react-native';

import SignatureCapture from 'react-native-signature-capture';
import { NavigationActions } from "react-navigation";
import Header from '../../components/back_header.js';
import CONFIG from '../../config/config.js';

export default class Signature extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      loading: true,
    };
  }

  saveSign() {
    this.refs["sign"].saveImage();
  }

  resetSign() {
    this.setState({disabled: true});
    this.refs["sign"].resetImage();
  }

  _onSaveEvent(result) {
    const encode_image = 'data:image/png;base64,'+result.encoded
    //alert(encode_image);
    if (this.props.navigation.state.params.picker_state!=null){
      let data = this.props.navigation.state.params;
      this._navigate('Qrcode', {
        picker_state: data.picker_state,
        extra_milage: data.extra_milage,
        injury_status: data.injury_status,
        call_to_duty_hours: data.call_to_duty_hours,
        signature: encode_image,
        questions: data.questions
      });
    }
    console.log(result);
  }
  _onDragEvent() {
    this.setState({disabled: false});
    console.log("dragged");
  }
  _navigate(name, data) {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     picker_state: data.picker_state,
    //     extra_milage: data.extra_milage,
    //     injury_status: data.injury_status,
    //     signature: data.signature,
    //     call_to_duty_hours: data.call_to_duty_hours
    //   }
    // })
    const navigate = NavigationActions.navigate({
      routeName: name,
      params: data
    });
    this.props.navigation.dispatch(navigate);
  }
  render() {
    return (
      <Container>
        <Header
          navigator={this.props.navigation}
          ref={(header) => { this.header = header; }}
          title = {"Signature"}
          signature = {true}
        />
        <Content style={{backgroundColor : '#EEEEEE'}} scrollEnabled={false}>
          <StatusBar backgroundColor= {CONFIG.theme_color} />
          <View style={{ flex: 1, flexDirection: "row",justifyContent: 'center',marginTop: 10  }}>
            <Button small iconLeft style={{ backgroundColor: CONFIG.theme_color, width : 150, justifyContent: 'center', alignItems:'center' }}>
              <Icon name='ios-create-outline' />
              <Text style={{color: 'white'}}>Client’s Signature</Text>
            </Button>
          </View>
          <SignatureCapture
            style={[{flex:1},styles.signature]}
            ref="sign"
            onSaveEvent={this._onSaveEvent.bind(this)}
            onDragEvent={this._onDragEvent.bind(this)}
            saveImageFileInExtStorage={false}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode={"portrait"}
          />

          <View style={{ flex: 1, flexDirection: "row",justifyContent: 'center', marginTop: 7, marginBottom:10}}>

            <Button style={{justifyContent:'center', borderColor: CONFIG.theme_color, backgroundColor: CONFIG.theme_color,width:100, borderRadius:10 }} onPress={ () => this.resetSign() }>
              <Text style={{color: 'white'}}>RESET</Text>
            </Button>
            <Button disabled={this.state.disabled} style={{justifyContent:'center', borderColor: CONFIG.success_color, backgroundColor: CONFIG.success_color, width:100, borderRadius:10, marginLeft:20 }} onPress={ () => this.saveSign()}>
              <Text style={{color: 'white'}}>SAVE</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

let height = (Platform.OS === 'ios') ? 180:  200

const styles = StyleSheet.create({
  signature: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    height: Dimensions.get("window").height - height,
    borderColor: 'black'
  }
});