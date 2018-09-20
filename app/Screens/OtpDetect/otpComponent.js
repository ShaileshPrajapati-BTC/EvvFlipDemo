import React, {Component} from 'react';
import {
  Body,
  Button,
  Container,
  Content,
  Form,
  Header,
  Icon,
  Input,
  Item,
  Left,
  List,
  ListItem,
  Right,
  Spinner,
  Text,
  Title
} from 'native-base';

import {Platform, StatusBar, View, Image} from 'react-native';

import CONFIG from '../../config/config.js';
import Helper from '../../config/Helper.js';
import DropdownAlert from 'react-native-dropdownalert';
import {NavigationActions, StackActions} from "react-navigation";
import THEME from '../../config/theme.js';
import CommonStyles from '../../config/commonStyle.js';

export default class OtpDetect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      forget_mobile: '',
      otp_disabled: false,
      otp: ''
    };
    this.otp_detect_listner = null;
  }

  componentWillReceiveProps() {
    console.log("Props =>>>>>>>>>", this.props.params);
    if (this.props.mobile != null) {
      this.setState({forget_mobile: this.props.mobile});
    }
  }

  componentWillMount() {
    console.log("Props =>>>>>>>>>", this.props);
    if (this.props.mobile != null) {
      this.setState({forget_mobile: this.props.mobile});
    }
  }

  componentDidMount() {
    // this._detectSms()
  }

  componentWillUnmount() {
    // this._removeSmsListner();
    console.log("unmount listner");
  }

  _back_press() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({
        routeName: 'Login'
      })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  _removeSmsListner() {
    if (this.otp_detect_listner != null) {
      this.otp_detect_listner.remove();
      console.log("removed Listner");
    }
  }

  _navigate(name, data) {
    console.log("otp data", data)
    const navigate = NavigationActions.navigate({
      routeName: name,
      params: {otpData: data}
    });
    this.props.navigation.dispatch(navigate);
  }

  _setPassword() {
    this.props.navigator.push({
      name: 'SetPassword',
      passProps: {
        msg: {}
      }
    })
  }

  _validate() {
    if (this.state.otp.length === 0) {
      this.otp_dropdown.alertWithType('error', "", CONFIG.otpValidationText);
    } else {
      this._checkOtp();
    }
  }

  _detectSms() {
    this._removeSmsListner();
    this.otp_detect_listner = SmsListener.addListener(message => {
      let verificationCodeRegex = /OTP:([\d]{6})/
      console.log("message bodyyyyyyyyyy ", message)

      if (verificationCodeRegex.test(message.body)) {
        let verificationCode = message.body.match(verificationCodeRegex)[1]
        this.setState({otp: verificationCode});
        this._checkOtp();
        console.log("sms =========", verificationCode, message);
      }

    })
  }

  async _checkOtp() {
    this.setState({otp_disabled: true})
    this.otp_dropdown.alertWithType('success', 'Thank you!', "OTP verified successfully!");
    setTimeout(() => {
      this._navigate('SetPassword', {mobile: this.state.forget_mobile, otp: this.state.otp});
      this.setState({otp_disabled: false});
    }, 600);
  }

  async _reSendOTP() {
    this.setState({otp: ''});
    this.setState({otp_disabled: true})
    this.otp_dropdown.alertWithType('success', 'Thank you!', "OTP will be sent via SMS");
    this.setState({otp_disabled: false});
  }

  render() {
    return (
      <Container>
        <Header style={CommonStyles.header}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this._back_press()} style={{height: 60}}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
            </Button>
          </Left>
          <Body style={{flex: 1}}>
          <Text style={CommonStyles.headerTitle}>{CONFIG.headerText}</Text>
          </Body>
          <Right/>
          <DropdownAlert
            ref={(ref) => this.otp_dropdown = ref}
            updateStatusBar={false}
            successColor={THEME.successAlert}
            titleNumOfLines={0}
            messageStyle={CommonStyles.dropDownAlert}
          />
        </Header>
        <StatusBar backgroundColor={CONFIG.theme_color}/>
        <Content contentContainerStyle={CommonStyles.contentStyle} extraScrollHeight={100} disableKBDismissScroll={true}>
          
        <Image square  style={CommonStyles.logoStyle} source={require('../../images/logoo.png')}/>

          <View style={{marginBottom: 20, marginTop: 10}}>
            <Text style={CommonStyles.boldTextStyle}>
              {CONFIG.otpScrnText1}
            </Text>
            <Text style={CommonStyles.boldTextStyle}>
            {CONFIG.otpScrnText2}
            </Text>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={CommonStyles.grayTextStyle}>
            {CONFIG.otpScrnText3}
            </Text>
            <Text style={CommonStyles.grayTextStyle}>
            {CONFIG.otpScrnText4}
            </Text>
          </View>
          <Item style={CommonStyles.otpInputStyle}>
            <Input
              style={{fontSize: 20, color:THEME.textColor,textAlign: 'center',}}
              maxLength={6}
              value={this.state.otp}
              keyboardType="numeric"
              placeholder={CONFIG.otpInput} 
              placeholderTextColor={THEME.textColor}
              onChangeText={(text) => {
                this.setState({otp: text})
              }}/>
          </Item>
          {(this.state.otp_disabled) ? <Spinner color={THEME.spinnerColor}/> :
            <View style={CommonStyles.otpBtnContainer}>
              <Button
                iconLeft
                bordered={this.state.location_service}
                onPress={() => this._validate()}
                style={CommonStyles.otpSubmitButton}>
                <Text style={CommonStyles.buttonTextStyle}> {CONFIG.otpSubmitText} </Text>
              </Button>
              <Button
                iconLeft
                bordered={this.state.location_service}
                onPress={() => this._reSendOTP()}
                style={CommonStyles.otpSubmitButton}>
                <Text style={CommonStyles.buttonTextStyle}> {CONFIG.otpResendText} </Text>
              </Button>
            </View>}
        </Content>
      </Container>
    );
  }
}