import React, {Component} from 'react';
import {Body, Button, Header, Icon, Left, Right, Subtitle, Text, Thumbnail, Title} from 'native-base';

import {AsyncStorage, Platform} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import {NavigationActions} from 'react-navigation';
import CONFIG from '../config/config.js';

export default class BackHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      scan_status: '',
      profile: 'https://www.b1g1.com/assets/admin/images/no_image_user.png'
    }; 
  }

  componentWillMount(){
    if (this.props.title != null){
      this.setState({name: this.props.title});
    }else{
      AsyncStorage.getItem('name', (err, result) => {
        name = JSON.parse(result)      
        if (name!=null){
          this.setState({name: name});
        }
      });
    }
  }

  _logout(){
    AsyncStorage.multiRemove(['token','scan_status', 'clock_status','in_out_status'], (err, result) => {
      this._navigate('Splash');
    });
  }
  
  _navigate(name) {
    this.props.navigator.push({
      name: name
    })
  }
  _alert(msg){
    if (msg!=null){
      var title = msg.status === "success" ? "Thank you!" : ""
      this.dropdown.alertWithType(msg.status, title, msg.message);
    }  
  }

  _back_press(route='TabList'){
    try{
      // const routes = this.props.navigator.getCurrentRoutes();
      // const routeToGo = routes.find( route => route.name === 'TabList');
      // this.props.navigator.popToRoute(routeToGo);
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({
          routeName: route,
          params: {msg: {}}
        })],
      });
      this.props.navigator.dispatch(resetAction);
    }catch(error){
      console.log("handle error", error)
    }
    //this._navigate('Scan',null);
  }

  _back_to_setup_beacon(){
    // routes = this.props.navigator.getCurrentRoutes();
    // routeToGo = routes.find( route => route.name == 'InstallBeacon');
    // routeToGo.passProps = Object.assign(routeToGo.passProps,{button: this.props.beacon_setup})
    // console.log(routeToGo,"route tot goooooooooo");
    // this.props.navigator.popToRoute(routeToGo);
    this.props.navigator.goBack();
  }

  _checkRoutes(){
    try{
      // const routes = this.props.navigator.getCurrentRoutes();
      if(this.props.qr_code === true && this.props.qr_code !== null){
        console.log("poping in ==========");
        this.props.navigator.goBack();
      }else if (this.props.beacon_setup !== null && this.props.beacon_setup === true){
        //const routeToGo = routes.find( route => route.name === 'InstallBeacon');
        // this._back_press("InstallBeacon");
        const resetAction = NavigationActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({routeName: 'TabList', params: {msg: {}}}),
            NavigationActions.navigate({ routeName: 'InstallBeacon', params: {} }),
          ],
        });
        this.props.navigator.dispatch(resetAction);
      }else if(this.props.careplan !== null && this.props.careplan === true){
        this.props.navigator.goBack();
      }else if(this.props.signature !== null && this.props.signature === true){
        this._back_press()
      }else if(this.props.scanQr !== null && this.props.scanQr === true){
        this._back_press()
      }else if(this.props.show_back_button !== null && this.props.show_back_button === false){
        this.props.navigator.goBack();
      }else{
        this.props.navigator.goBack();
      }
    }catch(error){
      console.log("handle back", error)
    }
  }

  render() {
    return (
        <Header style={{ backgroundColor: CONFIG.theme_color, height: (Platform.OS === 'ios') ? 74 : 64}}>
          {(this.props.show_back_button !== null && this.props.show_back_button === true) ?
            <Left style={{flex: 1}}/> :
            <Left style={{flex: 1}}>
              <Button transparent onPress={ () => this._checkRoutes()} style={{height: 60}}>
                <Icon name="arrow-back" style={{color: 'white'}}/>
              </Button>
            </Left> 
          }
            <Body style={{flex: 1}}>
              <Text style={{color: 'white', fontSize: 15}}>{`${this.state.name}`.substring(0,14)}</Text>
            </Body>
          <Right/>
          <DropdownAlert 
            ref={(ref) => this.dropdown = ref} 
            updateStatusBar={false} 
            successColor={CONFIG.success_color}
            messageStyle={{ fontSize: 13, textAlign: 'left', color: 'white', backgroundColor: 'transparent' }}
            elevation={5}
          />
        </Header>
    );
  }
}