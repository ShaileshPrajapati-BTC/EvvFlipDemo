import React, {Component} from 'react';
import {Button, Container, Content, Form, Header, Icon, Input, Item, Label, Spinner, Text, Title} from 'native-base';

import {AsyncStorage, Image, StatusBar,} from 'react-native';

import CONFIG from '../../config/config.js';
// import {JapanConfig as CONFIG} from '../../config/japan.js';
import DropdownAlert from 'react-native-dropdownalert';
import Helper from '../../config/Helper.js';
import FormPasswordInput from '../../components/formPasswordInput.js';
import FormMobileInput from '../../components/formMobileInput.js';
import { NavigationActions } from "react-navigation";
import THEME from '../../config/theme.js';
import CommonStyles from '../../config/commonStyle.js';

export default class LoginComponent extends Component {

  componentWillMount(){
    console.log("on login");
  }

  componentDidMount(){
  }
  _validate(mobile){
    if (this.props.login.mobile.length === 0){
      this.dropdown.alertWithType('error', "", CONFIG.mobile);
    }else if (this.props.login.mobile.length < 10 ){
      this.dropdown.alertWithType('error', "", CONFIG.invalid_mobile);
    }else if (this.props.login.password.length === 0){
      this.dropdown.alertWithType('error', "", CONFIG.password);
    }else{
      this.login();
    }
  }

  async login(){
    this._checkIntroduction(CONFIG.successLogin);
  }
  _checkIntroduction(message){
    console.log("sss");
      AsyncStorage.getItem("introduction", (err, result) => {
        console.log("result=>>>>>>.", result);
        if (result !=null && result === 'true'){
          this._navigate('Intro',{});
          AsyncStorage.setItem("introduction", 'false');
        }else{
         console.log("navigate---")
          this._navigate('TabList', {status: 'success', message: message, show_checklist: true});
        }
    });
  }

  _navigate(name, msg_obj) {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     msg: msg_obj
    //   }
    // })
    this.props.MobileChange('login', true)
    const navigate = NavigationActions.navigate({
      routeName: name,
      params: { msg: msg_obj }
    });
    this.props.navigation.dispatch(navigate);
  }

  onTextChange = (field, value)=>{
    this.props.MobileChange(field, value)
  }
  
  _forgotClick(){
    this._navigate('ForgotPassword',{});
    this.props.MobileChange('mobile', '')
    this.props.MobileChange('password', '')
  }
  
  render(){
    console.log(this.props)
    return(
      <Container >
        <Content scrollEnabled={false} 
          contentContainerStyle={styles.containerStyle}>
          <StatusBar backgroundColor={THEME.themeColor}/>
          <Image square  style={CommonStyles.logoStyle} source={require('../../images/logoo.png')}/>
          <Form style={styles.formStyles}>
            <FormMobileInput 
              name = 'mobile'
              placeholder = {CONFIG.mobileNumberLabel}
              onTextChange={(name, value) => this.props.MobileChange(name, value)}
            />
            <FormPasswordInput 
              placeholder = {CONFIG.passwordLabel}
              name = 'password'
              onTextChange={(name, value) => this.props.MobileChange(name, value)}
            />
            <Button 
              style={CommonStyles.buttonStyle} 
              onPress={ () => this._validate() }
            >
              {(this.props.login.disabled)? <Spinner color={THEME.themeColor}/> : 
                <Text style={CommonStyles.buttonTextStyle}>{CONFIG.signIn}</Text>}
            </Button>
            <Text style={{alignSelf:'center', color: THEME.clickText}} onPress={ () => this._forgotClick() }> {CONFIG.forgotPassword} </Text>
          </Form>
        </Content>
        <DropdownAlert ref={(ref) => this.dropdown = ref} updateStatusBar={false} successColor={CONFIG.success_color} titleNumOfLines={0}/>
      </Container>
    )
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.themeColor
  },
  formStyles: {
    alignSelf: 'center',
    marginTop: 50,
    marginRight: 15
  }
}