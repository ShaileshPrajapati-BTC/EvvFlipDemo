import React, {Component} from 'react';
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title} from 'native-base';

import {Platform, RefreshControl, StatusBar,} from 'react-native';

import CONFIG from '../../config/config.js';
import Loading from '../../components/Loading.js';
import Helper from '../../config/Helper.js';
import NoNotification from './emptyNotificationComponent.js';
import NotificationList from './notificationListComponent.js';
import DropdownAlert from 'react-native-dropdownalert';
import { NavigationActions } from 'react-navigation';

export default class NotificationComponent extends Component {

  constructor(props) {
    super(props);
    this.state ={
      loading: true,
      refreshing: false,
    };
  }
  
  componentWillMount(){
    console.log("------------------",this.props)
    this._getNotificationList();
  }

  componentDidMount() {}
  
  _confirmation_for_refused(message){
    Helper._alertPopupWithCallback("", message, 
      () => {
        this._navigate('Task')
      },
      "OK"
    );
  }

  async _interactionCheckList(id, response_status, time=0, location){
    this.setState({loading: true})
    try {
      setTimeout(()=>{
        this.setState({loading: false});
      }, 1000)
      this._alert({status: 'success', message: "Thank You your response saved"});
    }catch(error) {
      console.log(error);
    }
  }

  async _extendAppointment(id, extended_hours, refused = false){
    this.setState({loading: true})
    try {
      setTimeout(()=>{
        this.setState({loading: false});
      }, 1000)
      this._alert({status: 'success', message: "Thank You your response saved"});
    }catch(error) {
      console.log(error);
    }
  }

  async _updateNotification(id, response_status){
    this.setState({loading: true})
    try {
      setTimeout(()=>{
        this.setState({loading: false});
      }, 1000)
      this._alert({status: 'success', message: "Thank You your response saved"});
    }catch(error) {
      console.log(error);
    }
  }

  async _getNotificationList(){
    setTimeout(()=>{
      this.setState({loading: false});
    }, 1000)
  }

  async _visitStatusLocation(id, status, location,late_timings=0){
    this.setState({loading: true})
    try {
      setTimeout(()=>{
        this.setState({loading: false});
      }, 1000)
      this._alert({status: 'success', message: "Thank You your response saved"});
    }catch(error) {
      console.log(error);
    }
  }

  _showApiResponse = (res) => {
    console.log(res, "response-------");
    this._getNotificationList();
    if (res.status === true){
      this._alert({status: 'success', message: res.message});
    }else if(res.status === false){
      this._alert({status: 'error', message: res.message});
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._getNotificationList().then(() => {
      this.setState({refreshing: false});
    });
  }

  _navigate(name) {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     type: type
    //   }
    // })
    const navigateToScreen2 = NavigationActions.navigate({
      routeName: name,
    });
    this.props.navigation.dispatch(navigateToScreen2);
  }

  _notificationStyle(notification){
    if (notification.length > 0){
     return {}
    }else{
      return {flex: 1, justifyContent: 'center', alignItems: 'center'}
    }
  }

  _checkRoutes(){
    try{
      // let routes = this.props.navigator.getCurrentRoutes();
      // let routeToGo = routes.find( route => route.name === 'TabList');
      // this.props.navigation.goBack();
      if(this.props.navigation.state.params.TabList != null){
        this.props.navigation.goBack()
      }else{
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({
            routeName: 'TabList',
            params: {msg: {}}
          })],
        });
        this.props.navigation.dispatch(resetAction);
      }
    }catch(error){
      console.log("handle back", error)
    }
  }

  _alert(msg){
    if (msg!=null){
      var title = msg.status === "success" ? "Thank you!" : ""
      this.dropdown.alertWithType(msg.status, title, msg.message);
    }  
  }

  render() {
    const notification = this.props.notificationList;
    console.log("notification change")
    return (
      <Container>
        <Header style={{ backgroundColor: CONFIG.theme_color, height: (Platform.OS === 'ios') ? 74 : 64}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={ () => this._checkRoutes()} style={{height: 60}}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
            </Button>
          </Left> 
          <Body style={{flex: 1}}>
            <Text style={{color: 'white', fontSize: 16}}>Notifications</Text>
          </Body>
          <Right/>
        </Header>
        <StatusBar backgroundColor={CONFIG.theme_color} />
        {(this.state.loading)? <Loading/> :
          <Content refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          } contentContainerStyle={this._notificationStyle(notification)}>
          {(notification.length > 0)? 
            <NotificationList
              navigation={this.props.navigation}
              data={notification} 
              notification={this}
              location_permission={this.props.location_permission}
              /> : <NoNotification/> }
          </Content>}
          <DropdownAlert 
            ref={(ref) => this.dropdown = ref} 
            updateStatusBar={false} 
            successColor={CONFIG.success_color}
            messageStyle={{ fontSize: 13, textAlign: 'left', color: 'white', backgroundColor: 'transparent' }}
            elevation={10}
            messageNumOfLines={5}
          />
      </Container>
    );
  }
}