import React, {Component} from 'react';
import {
  Badge,
  Body,
  Button,
  Container,
  Content,
  Drawer,
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
  Switch,
  Tab,
  TabHeading,
  Tabs,
  Text,
  Thumbnail,
  Title
} from 'native-base';

import {Alert, AppState, AsyncStorage, LinkingIOS, Platform, StatusBar} from 'react-native';

import CONFIG from '../../config/config.js';
import LiveTask from '../LiveChecklist/index.js';
import Nodata from '../../components/no_data.js';
import AppointmentList from '../Appointment/index.js'
import Helper from '../../config/Helper.js';
import PermissionHelper from '../../config/permission_helper.js';
import SideMenu from '../SideMenu/index.js';
import PushNotification from '../NotificationList/pushNotificationController.js';
import FCM from 'react-native-fcm';
import DropdownAlert from 'react-native-dropdownalert';
import ScanComponent from '../Scan/index.js';
import {NavigationActions} from "react-navigation";


export default class TabList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location_service: true,
      bluetooth_service: true,
      fetchData: false,
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    AppState.addEventListener('change', this._handleAppStateChange);
    this._getNotificationCountFromServer();
    console.log(this.props, "TAbl99----")
    let params = this.props.navigation.state.params.msg;
    if (params.status != null) {
      let title = params.status === "success" ? "Thank you!" : "";
      this.dropdown.alertWithType(params.status, title, params.message);
    }
    setTimeout(() => {
      this._force_logout(params);
      if (params.tracking != null && params.tracking == true){
        this.props.SendAppOpenTracking()
        this._getInitialNotification()
      }
    }, 1000);
    console.log("Tab list propsssss", this.props)
  }

  _getInitialNotification(){
    FCM.getInitialNotification().then(notif=>{
       console.log("iniit-------------------clear",notif)
        if(notif['google.sent_time'] != null){
          this._navigate('Notification',{});
        }
    });
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      // alert("come active state")
      this._getNotificationCountFromServer()
    }
    //this.setState({appState: nextAppState});
  }

  _force_logout(params) {
    if (params.logout != null && params.logout === true) {
      this._confirmation_for_logout();
    }

  }

  _getNotificationCount = (value = false) => {
    this._getNotificationCountFromServer();
  }

  _getNotificationCountFromServer() {
    try {
      this.props.UpdateNotificationCount()
        .then((responseData) => {
          console.log(" notifications count ----------------------->")
          console.log(responseData);
          if (responseData.status === true) {
            FCM.setBadgeNumber(parseInt(responseData.data.notifications.pending_count));
          }
        })
        .catch(function (error) {
          console.log(error)
        });
    } catch (error) {
    }
  }

  _navigate = (name, params = {}) => {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {}
    // });
    const navigateToScreen2 = NavigationActions.navigate({
      routeName: name,
      params: params
    });
    this.props.navigation.dispatch(navigateToScreen2);
  }

  _confirmation_for_logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this._logoutAfterResetPassword()},
      ],
      {cancelable: false}
    )
  }

  closeDrawer = () => {
    try{
      if(this.drawer._root!=null){
        this.drawer._root.close()
      }
      console.log("closed",this.drawer._root)
    }catch(error){
      console.log("drawer error")
    }
  };

  openDrawer = () => {
    this.drawer._root.open()
  };

  _logoutAfterResetPassword = () => {
    try {
      let body = {
        longitude: '',
        latitude: '',
        device_info: this.props.deviceinfo
      }
      let uuid = this.props.userData.uuid
      this.props.Logout(body)
        .then((res) => {
          console.log(res);
          if (res.status === true) {
            // this._offlineTrackDataSend();
            // this._stopTracking();
            // $this._stopAndroidLocationTracking();
            AsyncStorage.removeItem("fcm_token");
            FCM.setBadgeNumber(0);
            this.props.StopBeacon(true, uuid);
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({
                routeName: 'Login'
              })],
            });
            this.props.navigation.dispatch(resetAction);
          }
          else if (res.status === false) {
            Helper._alertPopup('', res.message);
          }
        }).catch((error) => {
        Helper.apiResponseAlert(error, CONFIG.logout_api_error_404);
        console.log(error, "++++++++++++ logout");
      });
    } catch (error) {
      console.log(error, "=========> logout");
    }
  };

  handleChangeTab = ({i, ref, from,}) => {
    console.log("Tab changes =====================>")
    if (i === 1) {
      this.setState({fetchData: true});
    } else {
      this.setState({fetchData: false});
    }
    setTimeout(() => {
      this.setState({fetchData: false})
    }, 1000)
  }

  renderCheckList = () => {
    if (this.props.in_out_status === 'Out' && this.props.userData.user_type === true) {
      return (<LiveTask 
                showButton={this.props.userData.user_type} 
                showAlert={this.dropdown} 
                fetchData={this.state.fetchData}
                navigator={this.props.navigator}/>)
    }else if(this.props.userData.user_type === false){
      return (<Nodata message={CONFIG.notAbleToSubmitChecklist}/>)
    }else{
      return (<Nodata message="Please Check-in to view today's Checklist."/>)
    }
  }
  render() {
    const {pending_count, incomplete_visit_count} = this.props.notification_count.notificationCountData;
    const {fullname, avatar, user_type, token} = this.props.login.loginData;
    try {
      return (
        <Drawer
          ref={(ref) => {
            this.drawer = ref;
          }}
          content={<SideMenu
            _navigate={this._navigate}
            side_menu={false}
            profile={avatar}
            name={fullname}
            closeDrawer={this.closeDrawer}
            log_out={this._confirmation_for_logout}
            log_out_after_reset_pass={this._logoutAfterResetPassword}
            incomplete_count={incomplete_visit_count}
            userData={this.props.userData}
          />}
          panThreshold={.25}
        >
          <Container>
            <Header style={{backgroundColor: CONFIG.theme_color, height: (Platform.OS === 'ios') ? 74 : 64}}>
              <Left style={{flex: 1}}>
                <Button transparent onPress={() => this.openDrawer()}>
                  <Icon name='md-menu' style={{color: 'white'}}/>
                </Button>
              </Left>
              <Body style={{flex: 1}}>
              <Text style={{color: 'white', fontSize: 16}}>EVV Systems</Text>
              </Body>
              <Right>
                {(user_type) &&
                <Button transparent onPress={() => this._navigate('Notification', {TabList: true})}>
                  <Icon name='md-notifications' style={{color: 'white', fontSize: 32}}/>
                  {(pending_count > 0) &&
                  <Badge style={{
                    position: 'absolute',
                    right: 5, top: 0, height: 22, width: 22, justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'red', borderRadius: 11
                  }}>
                    <Text style={{
                      fontSize: 10,
                      lineHeight: 10,
                      color: 'white'
                    }}>{(pending_count > 9) ? '+9' : pending_count}</Text>
                  </Badge>}
                </Button>}
              </Right>
            </Header>
            <StatusBar backgroundColor={CONFIG.theme_color}/>
            <PushNotification
              token={token}
              navigation={this.props.navigation}
              notificationCount={this._getNotificationCount}
            />
            <Tabs
              locked={true}
              initialPage={0}
              tabBarPosition='bottom'
              tabBarUnderlineStyle={{backgroundColor: '#004FBB'}}
              tabStyle={{backgroundColor: 'red'}}
              tabBarActiveTextColor="white"
              activeTabStyle={{backgroundColor: 'red', height: 40}}
              onChangeTab={this.handleChangeTab}
            >
              <Tab
                heading={
                  <TabHeading style={{
                    backgroundColor: (Platform.OS === 'ios') ? '' : CONFIG.theme_color,
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    <Icon name="md-qr-scanner"/>
                    <Text style={{marginBottom: 3, fontSize: 14}}>Scan</Text>
                  </TabHeading>
                }
              >
                <ScanComponent
                  _navigate={this._navigate}
                  incomplete_count={incomplete_visit_count}/>
              </Tab>
              <Tab
                heading={
                  <TabHeading style={{
                    backgroundColor: (Platform.OS === 'ios') ? '' : CONFIG.theme_color,
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    <Icon name="md-list-box"/>
                    <Text style={{marginBottom: 3, fontSize: 14}}>Checklist</Text>
                  </TabHeading>
                }
              >
                {/*{(this.props.in_out_status === 'Out') ?*/}
                  {/*<LiveTask showButton={user_type} showAlert={this.dropdown} fetchData={this.state.fetchData}*/}
                            {/*navigator={this.props.navigator}/> :*/}
                  {/*<Nodata message="Please Check-in to view today's Checklist."/>}*/}
                {this.renderCheckList()}
              </Tab>
              <Tab
                heading={
                  <TabHeading style={{
                    backgroundColor: (Platform.OS === 'ios') ? '' : CONFIG.theme_color,
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    <Icon name="md-calendar"/>
                    <Text style={{marginBottom: 3, fontSize: 14}}>Schedules</Text>
                  </TabHeading>
                }
              >
                <AppointmentList token={token}/>
              </Tab>
            </Tabs>
            <DropdownAlert
              ref={(ref) => this.dropdown = ref}
              updateStatusBar={false}
              successColor={CONFIG.success_color}
              messageStyle={{fontSize: 13, textAlign: 'left', color: 'white', backgroundColor: 'transparent'}}
              messageNumOfLines={5}
              elevation={5}
            />
          </Container>
        </Drawer>
      );
    } catch (error) {
      console.log(error, "crash->>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }
  }
}
