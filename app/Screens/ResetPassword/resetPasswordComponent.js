import React, { Component } from 'react';
import { 
  Container, 
  Content,
  Text,
  Button,
  Spinner,
  Icon,
  Form
} from 'native-base';

import {
  StatusBar,
  View
} from 'react-native';

import CONFIG from '../../config/config.js';
import Header from '../../components/back_header.js';   
import Helper from '../../config/Helper.js';
import FormPasswordInput from '../../components/formPasswordInput.js';
import THEME from '../../config/theme.js';
import CommonStyles from '../../config/commonStyle.js';

export default class ResetPassword extends Component {
  
  constructor(props) {
    super(props);
    this.state ={
      old_password: '',
      new_password: '',
      confirm_password: '',
      reset_disabled: false
    };
  }
 
  componentWillMount(){ 
    console.log("data",this.props)
  }

  _validate_reset_password(){
    if (this.state.old_password.length === 0 ){
      this.header._alert({status: 'error', message: "Please enter current password"});
    }else if(this.state.new_password.length === 0){
      this.header._alert({status: 'error', message: "Please enter new password"});
    }else if(this.state.confirm_password.length === 0){
      this.header._alert({status: 'error', message: "Please enter confirm password"});
    }else if (this.state.new_password != this.state.confirm_password ){
      this.header._alert({status: 'error', message: "New password and confirm password do not match"});
    }else{
      this.reset_password_api();
    }
  }

  async reset_password_api(){
    this.setState({reset_disabled: true})
    this.header._alert({status: 'success', message: 'Changed password successfully'});
    this.setState({reset_disabled: false, forget_mobile: ''});
    console.log("d--")
    setTimeout(() => {
      this.props.navigation.goBack();
      if(this.props.log_out != null){
        this.props.log_out();
      }
    }, 1000);
    
  }

  render(){
    return(
      <Container>
        <Header
          navigator={this.props.navigation}
          ref={(header) => { this.header = header; }} 
          title = {this.props.userData.fullname}
        />
        <StatusBar backgroundColor={THEME.themeColor} />
        <Content 
          contentContainerStyle={CommonStyles.contentStyle} 
          extraScrollHeight={250} disableKBDismissScroll={true}
        >
          <Icon 
            theme={{ iconFamily: 'FontAwesome' }}
            name="md-unlock" 
            style={styles.smsIcon}
          />
          <View style={{marginBottom: 15}}>
            <Text style={styles.boldTextStyle}> 
            Change your password
            </Text>
          </View>
          <View style={{marginBottom: 15}}>
            <Text style={styles.grayTextStyle}>
            Enter a new password for your account.
            </Text>
          </View>
          <Form style={{alignSelf: 'center', marginTop:15, marginRight: 15}} >
            <FormPasswordInput 
              placeholder = "Current password"
              name = 'old_password'
              onTextChange={(name, value) => this.setState({old_password: value})}
            />
            <FormPasswordInput 
              placeholder = "New password"
              name = 'new_password'
              onTextChange={(name, value) => this.setState({new_password: value})}
            />
            <FormPasswordInput 
              placeholder = "Confirm password"
              name = 'confirm_password'
              onTextChange={(name, value) => this.setState({confirm_password: value})}
            />
            <Button 
              disabled={this.state.reset_disabled}
              style={{justifyContent:'center',borderColor: CONFIG.theme_color, backgroundColor: CONFIG.theme_color,borderRadius:10, marginTop: 25, marginBottom: 20, marginLeft:15,width:285,borderWidth:1 }}
              onPress={ () => this._validate_reset_password() }>
              {(this.state.reset_disabled)? <Spinner color='#ffffff'/> : <Text>CHANGE PASSWORD</Text>}
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

let styles = {
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