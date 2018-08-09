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

import {StatusBar, View} from 'react-native';

import CONFIG from '../../config/config.js';
import Helper from '../../config/Helper.js';
import DropdownAlert from 'react-native-dropdownalert';
import FormPasswordInput from '../../components/formPasswordInput.js';
import { NavigationActions } from "react-navigation";

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
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({
        routeName: 'Login'
      })],
    });
    this.props.navigation.dispatch(resetAction);
  }
  
  _validate_reset_password(){
    if(this.state.new_password.length === 0){
      this.reset_password.alertWithType("error", "", "Please enter new password");
    }else if(this.state.confirm_password.length === 0){
      this.reset_password.alertWithType("error", "", "Please enter confirm password");
    }else if (this.state.new_password !== this.state.confirm_password ){
      this.reset_password.alertWithType("error", "", "New password and confirm password do not match");
    }else{
      this.reset_password_api();
    }
  }

  async reset_password_api(){

    this.setState({reset_disabled: true})
    this.reset_password.alertWithType("success", "Thank you!", "Changed password successfully");
    this.setState({reset_disabled: false, forget_mobile: ''});
    setTimeout(() => {
      this._back_press();
    }, 1000);
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
            ref={(ref) => this.reset_password = ref} 
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
            name="md-unlock" 
            style={styles.smsIcon}
          />
          <View style={{marginBottom: 15}}>
            <Text style={styles.boldTextStyle}> 
              Reset your password
            </Text>
          </View>

          <View style={{marginBottom: 15}}>
            <Text style={styles.grayTextStyle}>
              Enter a new password for your account.
            </Text>
          </View>

          <Form style={{alignSelf: 'center', marginTop:15, marginRight: 15}}>            
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
              style={styles.submitButton}
              onPress={ () => this._validate_reset_password() }>
              {(this.state.reset_disabled)? <Spinner color='#ffffff'/> : <Text>SUBMIT</Text>}
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

var styles = {

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
  smsIcon: {
    color: CONFIG.theme_color, 
    alignSelf: 'center', 
    fontSize: 70, marginBottom: 20
  }
};