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
  Image
} from 'react-native';

import CONFIG from '../../config/config.js';
import Helper from '../../config/Helper.js';
import DropdownAlert from 'react-native-dropdownalert';
import FormMobileInput from '../../components/formMobileInput.js';
import { NavigationActions } from "react-navigation";
import THEME from '../../config/theme.js';
import CommonStyles from '../../config/commonStyle.js';

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
        <Header style={CommonStyles.header}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={ () => this._back_press()} style={{height: 60}}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
            </Button>
          </Left>
          <Body style={{flex: 1}}>
            <Text style={CommonStyles.headerTitle}>{CONFIG.headerText}</Text>
          </Body>
          <Right/>
          <DropdownAlert 
            ref={(ref) => this.forgot_dropdown = ref} 
            updateStatusBar={false} 
            successColor={THEME.successAlert} 
            titleNumOfLines={0}
            messageStyle={CommonStyles.dropDownAlert}
          />
        </Header>
        <StatusBar backgroundColor={CONFIG.theme_color} />
        <Content 
          contentContainerStyle={CommonStyles.contentStyle} 
          extraScrollHeight={100} 
          disableKBDismissScroll={true}
        >
          <Image square  style={CommonStyles.logoStyle} source={require('../../images/logoo.png')}/>

          <View style={{marginBottom: 20, marginTop: 10}}>
            <Text style={CommonStyles.boldTextStyle}> 
              {CONFIG.forgotPasswordSrnText1}
            </Text>
          </View>

          <View style={{marginBottom: 15}}>
            <Text style={CommonStyles.grayTextStyle}>
              {CONFIG.forgotPasswordSrnText2}
            </Text>
            <Text style={CommonStyles.grayTextStyle}>
              {CONFIG.forgotPasswordSrnText3}
            </Text>
          </View>

          <Form style={{alignSelf: 'center', marginTop:15, marginRight: 15}}>
            <FormMobileInput 
              name = 'forget_mobile'
              placeholder = {CONFIG.mobileNumberLabel}
              onTextChange={(name, value) => this.setState({forget_mobile: value})}
            />
            <Button 
              disabled={this.state.forget_disabled}
              style={CommonStyles.buttonStyle}
              onPress={ () => this._validate_forgot_password() }>
              {(this.state.forget_disabled)? <Spinner color={THEME.themeColor}/> : 
              <Text style={CommonStyles.buttonTextStyle}>{CONFIG.forgotButtonText}</Text>}
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}