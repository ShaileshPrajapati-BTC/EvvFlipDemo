import React, { Component } from 'react';
import { 
  Container, 
  Content,
  Text,
  Button,
  Spinner,
  Icon,
  Left,
  Right,
  Title,
  Form,
  Input,
  Item,
  List, 
  ListItem,
  Body,
  Header
} from 'native-base';

import {
  StatusBar,  
  View,
} from 'react-native';

import CONFIG from '../../config/config.js';
import Helper from '../../config/Helper.js';
import DropdownAlert from 'react-native-dropdownalert';
import FormMobileInput from '../../components/formMobileInput.js';
import { NavigationActions } from "react-navigation";

export default class ForgotPasswordComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state ={
      forget_password: false,
      forget_mobile: '',//remove
      forget_disabled: false
    };
  }
  componentWillReceiveProps(){}

  componentWillMount(){ 
    console.log(this.props, "forgot password")
  }

  _validate_forgot_password(){
    if (this.state.forget_mobile.length === 0){
      this.forgot_dropdown.alertWithType('error', "", CONFIG.mobile);
    }else if (this.state.forget_mobile.length < 10 ){
      this.forgot_dropdown.alertWithType('error', "", CONFIG.invalid_mobile);
    }else{
      this.forgot_password();
    }
  }

  _back_press(){
    this.props.navigation.goBack();
  }
  
  _navigate(name, data) {
    const navigate = NavigationActions.navigate({
      routeName: name,
      params: { mobile: data.mobile }
    });
    this.props.navigation.dispatch(navigate);
  }

  async forgot_password(){
    this.setState({forget_disabled: true})
    this.forgot_dropdown.alertWithType('success', 'Thank you!', "OTP will be sent via SMS");
    setTimeout(() => {
      this._navigate('OtpDetect',{mobile: this.state.forget_mobile});
    }, 600);
  }
  render(){
    return(
      <Container>
        <Header style={styles.header}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={ () => this._back_press()} style={{height: 60}}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
            </Button>
          </Left>
          <Body style={{flex: 1}}>
            <Text style={styles.header_title}>EVV systems</Text>
          </Body>
          <Right/>
          <DropdownAlert 
            ref={(ref) => this.forgot_dropdown = ref} 
            updateStatusBar={false} 
            successColor={CONFIG.success_color} 
            titleNumOfLines={0}
            messageStyle={{ fontSize: 13, textAlign: 'left', color: 'white', backgroundColor: 'transparent' }}
          />
        </Header>
        <StatusBar backgroundColor={CONFIG.theme_color} />
        <Content 
          contentContainerStyle={styles.contentStyle} 
          extraScrollHeight={100} 
          disableKBDismissScroll={true}
        >
          <Icon 
            theme={{ iconFamily: 'FontAwesome' }}
            name="md-lock" 
            style={styles.smsIcon}
          />
          <View style={{marginBottom: 20}}>
            <Text style={styles.boldTextStyle}> 
              Forgot your password ?
            </Text>
          </View>

          <View style={{marginBottom: 15}}>
            <Text style={styles.grayTextStyle}>
              We just need your registered Mobile number to sent
            </Text>
            <Text style={styles.grayTextStyle}>
               you password reset instructions.
            </Text>
          </View>

          <Form style={{alignSelf: 'center', marginTop:15, marginRight: 15}}>
            <FormMobileInput 
              name = 'forget_mobile'
              placeholder = 'Mobile number'
              onTextChange={(name, value) => this.setState({forget_mobile: value})}
            />
            <Button 
              disabled={this.state.forget_disabled}
              style={{justifyContent:'center',borderColor: CONFIG.theme_color, backgroundColor: CONFIG.theme_color,borderRadius:10, marginTop: 25, marginBottom: 20, marginLeft:15,width:285,borderWidth:1 }}
              onPress={ () => this._validate_forgot_password() }>
              {(this.state.forget_disabled)? <Spinner color='#ffffff'/> : <Text>SEND</Text>}
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

let styles = {

  header: { 
    backgroundColor: CONFIG.theme_color, 
    height: 64
  },
  header_title: {
    color: 'white', 
    fontSize: 16
  },
  contentStyle: {
    flex: 1 ,
    justifyContent: 'center', 
    alignSelf: 'center',
  },
  inputStyle: {
    borderColor: "#b5b3b3", 
    borderWidth:1, 
    borderRadius:5, 
    marginBottom: 15,
    marginTop: 8,
  },
  submitButton: {
    justifyContent:'center',
    borderColor: CONFIG.theme_color, 
    backgroundColor: CONFIG.theme_color,
    borderRadius:10, 
    marginTop: 25, 
    marginBottom: 15, 
    marginLeft:15,
    width:285,
    borderWidth:1 
  },
  grayTextStyle: {
    marginBottom: 5, 
    fontSize: 13, 
    color: '#a8a8a8',
    alignSelf: 'center'
  },
  boldTextStyle: {
    marginBottom: 5, 
    fontSize: 16, 
    alignSelf: 'center',
    color: '#3f3f3f'
  },
  smsIcon: {
    color: CONFIG.theme_color, 
    alignSelf: 'center', 
    fontSize: 70, marginBottom: 20
  }
};