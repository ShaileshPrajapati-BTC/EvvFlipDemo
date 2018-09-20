import React, {Component} from 'react';
import {
    Body,
    Button,
    Container,
    Content,
    Form,
    Header,
    Icon,
    Left,
    Right,
    Spinner,
    Text,
} from 'native-base';

import {StatusBar, View, Image} from 'react-native';

import CONFIG from '../../config/config.js';
import DropdownAlert from 'react-native-dropdownalert';
import FormPasswordInput from '../../components/formPasswordInput.js';
import { NavigationActions,StackActions } from "react-navigation";
import THEME from '../../config/theme.js';
import CommonStyles from '../../config/commonStyle.js';

export default class SetPassword extends Component {
  
  constructor(props) {
    super(props);
    this.state ={
      new_password: '',
      confirm_password: '',
      reset_disabled: false,
      mobile: '',
      otp: '',
      show_new_pwd: true,
      show_confirm_pwd: true
    };
  }
  componentWillReceiveProps(){
    console.log("Props =>>>>>>>>>", this.props);
  }

  componentWillMount(){
    if(this.props.mobile != null){
      this.setState({mobile: this.props.mobile, otp: this.props.otp});
    }
    console.log("otp params",this.props)
  }
  
  _back_press(){
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({
        routeName: 'Login'
      })],
    });
    this.props.navigation.dispatch(resetAction);
  }
  
  _validate_reset_password(){
    if(this.state.new_password.length === 0){
      this.reset_password.alertWithType("error", "", CONFIG.setPassValidForNew);
    }else if(this.state.confirm_password.length === 0){
      this.reset_password.alertWithType("error", "", CONFIG.setPassValidForConfirm);
    }else if (this.state.new_password !== this.state.confirm_password ){
      this.reset_password.alertWithType("error", "", CONFIG.setPassValidNotMatch);
    }else{
      this.reset_password_api();
    }
  }

  async reset_password_api(){

    this.setState({reset_disabled: true})
    this.reset_password.alertWithType("success", "Thank you!", "Changed password successfully");
    setTimeout(() => {
      this.setState({reset_disabled: false, forget_mobile: ''});
      this._back_press();
    }, 1000);
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
            ref={(ref) => this.reset_password = ref} 
            updateStatusBar={false} 
            successColor={THEME.successAlert} 
            titleNumOfLines={0}
            messageStyle={CommonStyles.dropDownAlert}
          />
        </Header>
        <StatusBar backgroundColor={THEME.themeColor} />
        <Content 
          contentContainerStyle={CommonStyles.contentStyle} 
          extraScrollHeight={100} 
          disableKBDismissScroll={true}
        >
          <Image square  style={CommonStyles.logoStyle} source={require('../../images/logoo.png')}/>
          <View style={{marginBottom: 15, marginTop: 10}}>
            <Text style={CommonStyles.boldTextStyle}> 
              {CONFIG.setPassText1}
            </Text>
          </View>

          <View style={{marginBottom: 15}}>
            <Text style={CommonStyles.grayTextStyle}>
              {CONFIG.setPassText2}
            </Text>
          </View>

          <Form style={CommonStyles.setPasswordForm}>            
            <FormPasswordInput 
              placeholder = {CONFIG.newPassword}
              name = 'new_password'
              onTextChange={(name, value) => this.setState({new_password: value})}
            />
            <FormPasswordInput 
              placeholder = {CONFIG.confirmPassword}
              name = 'confirm_password'
              onTextChange={(name, value) => this.setState({confirm_password: value})}
            />
            <Button 
              disabled={this.state.reset_disabled}
              style={CommonStyles.setPassSubmitBtn}
              onPress={ () => this._validate_reset_password() }>
              {(this.state.reset_disabled)? <Spinner color={THEME.themeColor}/> : 
                <Text style={CommonStyles.buttonTextStyle}>{CONFIG.setPassBtnText}</Text>}
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}