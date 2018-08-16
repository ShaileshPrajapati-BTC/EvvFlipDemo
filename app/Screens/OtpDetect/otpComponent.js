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

import {Platform, StatusBar, View} from 'react-native';

import CONFIG from '../../config/config.js';
import Helper from '../../config/Helper.js';
import DropdownAlert from 'react-native-dropdownalert';
import {NavigationActions} from "react-navigation";


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
    const resetAction = NavigationActions.reset({
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
      this.otp_dropdown.alertWithType('error', "", "Please enter OTP");
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
        <Header style={styles.header}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this._back_press()} style={{height: 60}}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
            </Button>
          </Left>
          <Body style={{flex: 1}}>
          <Text style={styles.header_title}>EVV systems</Text>
          </Body>
          <Right/>
          <DropdownAlert
            ref={(ref) => this.otp_dropdown = ref}
            updateStatusBar={false}
            successColor={CONFIG.success_color}
            titleNumOfLines={0}
            messageStyle={{fontSize: 13, textAlign: 'left', color: 'white', backgroundColor: 'transparent'}}
          />
        </Header>
        <StatusBar backgroundColor={CONFIG.theme_color}/>
        <Content contentContainerStyle={styles.contentStyle} extraScrollHeight={100} disableKBDismissScroll={true}>
          <Icon
            theme={{iconFamily: 'FontAwesome'}}
            name="md-chatboxes"
            style={styles.smsIcon}
          />
          <View style={{marginBottom: 20}}>
            <Text style={styles.boldTextStyle}>
              Sit back & Relax! while we verify your
            </Text>
            <Text style={styles.boldTextStyle}>
              mobile number
            </Text>
          </View>
          <View style={{marginBottom: 20}}>
            <Text style={styles.grayTextStyle}>
              Enter the OTP below in case if we fail to detect the
            </Text>
            <Text style={styles.grayTextStyle}>
              SMS automatically
            </Text>
          </View>
          <Item style={styles.inputStyle}>
            <Input
              style={{fontSize: 20, textAlign: 'center',}}
              maxLength={6}
              value={this.state.otp}
              keyboardType="numeric"
              placeholder='Enter OTP' placeholderTextColor="#b5b3b3"
              onChangeText={(text) => {
                this.setState({otp: text})
              }}/>
          </Item>
          {(this.state.otp_disabled) ? <Spinner color={CONFIG.theme_color}/> :
            <View style={styles.btnContainer}>
              <Button
                iconLeft
                bordered={this.state.location_service}
                onPress={() => this._validate()}
                style={styles.submitButton}>
                <Text> SUBMIT </Text>
              </Button>
              <Button
                iconLeft
                bordered={this.state.location_service}
                onPress={() => this._reSendOTP()}
                style={styles.submitButton}>
                <Text> RESEND </Text>
              </Button>
            </View>}
        </Content>
      </Container>
    );
  }
}

let styles = {

  header: {
    backgroundColor: CONFIG.theme_color,
    height: (Platform.OS === 'ios') ? 64 : 54
  },
  header_title: {
    color: 'white',
    fontSize: 16
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  boldTextStyle: {
    marginBottom: 5,
    fontSize: 16,
    alignSelf: 'center',
    color: '#3f3f3f'
  },
  grayTextStyle: {
    marginBottom: 5,
    fontSize: 13,
    color: '#a8a8a8',
    alignSelf: 'center'
  },
  inputStyle: {
    borderColor: "#b5b3b3",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 13,
    marginTop: 8,
    width: 195,
    alignSelf: 'center',
    height: 40,
  },
  submitButton: {
    marginBottom: 10,
    alignSelf: 'center',
    borderColor: CONFIG.theme_color,
    backgroundColor: CONFIG.theme_color,
    marginRight: 5,
    marginLeft: 5
  },
  smsIcon: {
    color: CONFIG.theme_color,
    alignSelf: 'center',
    fontSize: 70, marginBottom: 20
  },
  btnContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5
  }
};