import React, {Component} from 'react';
import {Text, Container, Content, Spinner} from 'native-base';

import {Alert, AsyncStorage, Image, Linking, Platform, StatusBar} from 'react-native';
import { NavigationActions } from "react-navigation";
import CONFIG from '../../config/config.js';
import THEME from '../../config/theme.js';

import Helper from '../../config/Helper.js';
import moment from 'moment-timezone';

export default class SplashComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: CONFIG.user_deactivate
    }
  }
  componentWillMount(){
    console.log("splash", this.props)
    this.props.MobileChange('mobile', '')
    this.props.MobileChange('password', '')
  }
  
  async componentDidMount(){
    AsyncStorage.getItem("introduction", (err, result) => {
      console.log("result=>>>>>>.", result)
      if (result == null){
        console.log("result is null");
         AsyncStorage.setItem("introduction", 'true');
       }
    });
    this.checkLogin()
  }

  checkLogin(remove_skip = false){ //send true when remove skip btn date validation
    setTimeout(()=>{
      if(this.props.isLoggedIn === false){
        this._navigate('Login','');
      }else{
        this._navigate('TabList', {show_checklist: true, tracking: true});
      }

      // this.setState({loading: false});
    }, 1000)
  }

  _navigate(name, type) {

    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     msg: type
    //   }
    // })
    const navigateToScreen2 = NavigationActions.navigate({
      routeName: name,
      params: { msg: type }
    });
    this.props.navigation.dispatch(navigateToScreen2);
  }

  render() {
    return (
      <Container>
        <Content scrollEnabled={false} contentContainerStyle={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: THEME.themeColor}}>
          <StatusBar backgroundColor={THEME.themeColor}/>
          <Image square  style={{alignSelf: 'center', width:150, height:150 }} source={require('../../images/logoo.png')}  />
          <Text style={{fontSize: 30, color: THEME.textColor,padding: 10}}>{CONFIG.splashText}</Text>
          <Spinner color={THEME.spinnerColor}/>            
        </Content>
      </Container>
    );
  }
}
