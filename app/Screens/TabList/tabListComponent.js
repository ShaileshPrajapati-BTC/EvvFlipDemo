import React, {Component} from 'react';
import {
  Badge,
  Body,
  Button,
  Container,
  Header,
  Icon,
  Left,
  Right,
  Tab,
  TabHeading,
  Tabs,
  Text
} from 'native-base';

import {Alert, StatusBar,DrawerLayoutAndroid,View} from 'react-native';

import CONFIG from '../../config/config.js';
import LiveTask from '../LiveChecklist/index.js';
import Nodata from '../../components/no_data.js';
import AppointmentList from '../Appointment/index.js'
import SideMenu from '../SideMenu/index.js';
// import PushNotification from '../NotificationList/pushNotificationController.js';
// import FCM from 'react-native-fcm';
import DropdownAlert from 'react-native-dropdownalert';
import ScanComponent from '../Scan/index.js';
import {NavigationActions,  StackActions} from "react-navigation";
import THEME from '../../config/theme.js';
import CommonStyles from '../../config/commonStyle.js';

export default class TabList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location_service: true,
      bluetooth_service: true,
      fetchData: false,
      page:0
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    // AppState.removeEventListener('change', this._handleAppStateChange);
    // AppState.addEventListener('change', this._handleAppStateChange);
    // this._getNotificationCountFromServer();
    console.log(this.props, "TAbl99----")
    let params = this.props.navigation.state.params.msg;
    if (params.status != null) {
      let title = params.status === "success" ? CONFIG.successAlertText : "";
      this.dropdown.alertWithType(params.status, title, params.message);
    }
    setTimeout(() => {
      this._force_logout(params);
      if (params.tracking != null && params.tracking == true){
        // this.props.SendAppOpenTracking()
        // this._getInitialNotification()
      }
    }, 1000);
    console.log("Tab list propsssss", this.props)
  }

  _getInitialNotification(){
    // FCM.getInitialNotification().then(notif=>{
    //    console.log("iniit-------------------clear",notif)
    //     if(notif['google.sent_time'] != null){
    //       this._navigate('Notification',{});
    //     }
    // });
  }

  _handleAppStateChange = (nextAppState) => {
    // if (nextAppState === 'active') {
    //   // alert("come active state")
    //   this._getNotificationCountFromServer()
    // }
    //this.setState({appState: nextAppState});
  }

  _force_logout(params) {
    if (params.logout != null && params.logout === true) {
      this._confirmation_for_logout();
    }

  }

  _getNotificationCount = (value = false) => {
    // this._getNotificationCountFromServer();
  }

  _getNotificationCountFromServer() {

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
      CONFIG.logoutTitle,
      CONFIG.logoutText,
      [
        {text: CONFIG.logoutCancelBtn, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: CONFIG.logoutOkBtn, onPress: () => this._logoutAfterResetPassword()},
      ],
      {cancelable: false}
    )
  }

  closeDrawer = () => {
    try{
      if(this.drawer!=null){
        this.drawer.closeDrawer()
      }
    }catch(error){
      console.log("drawer error")
    }
  };

  openDrawer = () => {
    this.drawer.openDrawer()
  };

  _logoutAfterResetPassword = () => {
    this.props.MobileChange('login', false)
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({
        routeName: 'Login'
      })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  handleChangeTab = ({i, ref, from,}) => {
    console.log("Tab changes =====================>")
    if (i === 1) {
      this.setState({fetchData: true,page: i});
    } else {
      this.setState({fetchData: false, page: i});
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
      return (<Nodata message={CONFIG.checklistViewMsg}/>)
    }
  }
  render() {
    const {pending_count, incomplete_visit_count} = this.props.notification_count.notificationCountData;
    const {fullname, avatar, user_type, token} = this.props.login.loginData;
    try {
      return (
        <DrawerLayoutAndroid
          drawerWidth={300}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          ref={(ref) => {
            this.drawer = ref;
          }}
          renderNavigationView={() =><SideMenu
            _navigate={this._navigate}
            side_menu={false}
            profile={avatar}
            name={fullname}
            closeDrawer={this.closeDrawer}
            log_out={this._confirmation_for_logout}
            log_out_after_reset_pass={this._logoutAfterResetPassword}
            incomplete_count={incomplete_visit_count}
            userData={this.props.userData}
          />}>
          <Container>
            <Header style={{backgroundColor: THEME.themeColor, height: 64}}>
              <Left style={{flex: 1}}>
                <Button transparent onPress={() => this.openDrawer()}>
                  <Icon name='md-menu' style={{color: 'white'}}/>
                </Button>
              </Left>
              <Body style={{flex: 1}}>
                <Text style={CommonStyles.headerTitle}>{CONFIG.headerText}</Text>
              </Body>
              <Right>
                {(user_type) &&
                <Button transparent onPress={() => this._navigate('Notification', {TabList: true})}>
                  <Icon name='md-notifications' style={CommonStyles.notificationIcon}/>
                  {(pending_count > 0) &&
                  <Badge style={CommonStyles.notificationBadge}>
                    <Text style={CommonStyles.badgeText}>{(pending_count > 9) ? '+9' : pending_count}</Text>
                  </Badge>}
                </Button>}
              </Right>
            </Header>
            <StatusBar backgroundColor={THEME.themeColor}/>
{/*            <PushNotification
              token={token}
              navigation={this.props.navigation}
              notificationCount={this._getNotificationCount}
            />*/}
            <Tabs
              locked={true}
              initialPage={0}
              tabBarPosition='bottom'
              tabBarUnderlineStyle={{backgroundColor: THEME.textColor}}
              onChangeTab={this.handleChangeTab}
            >
              <Tab
                heading={
                  <TabHeading style={CommonStyles.tabHeading} >
                    <Icon name="md-qr-scanner" style={{fontSize: this.state.page === 0? 20 : 25, color: THEME.textColor}}/>
                    {this.state.page === 0? <Text style={CommonStyles.tabText}>{CONFIG.tabText1}</Text> : null}
                  </TabHeading>
                }
              >
                <ScanComponent
                  _navigate={this._navigate}
                  incomplete_count={incomplete_visit_count}/>
              </Tab>
              <Tab
                heading={
                  <TabHeading style={CommonStyles.tabHeading}>
                    <Icon name="md-list-box" style={{fontSize: this.state.page === 1 ? 20 : 25, color: THEME.textColor}}/>
                    {this.state.page === 1 ? <Text style={CommonStyles.tabText}>{CONFIG.tabText2}</Text> : null}
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
                  <TabHeading style={CommonStyles.tabHeading}>
                    <Icon name="md-calendar" style={{fontSize: this.state.page === 2   ? 20 : 25,color: THEME.textColor}}/>
                    {this.state.page === 2 ? <Text style={CommonStyles.tabText}>{CONFIG.tabText3}</Text> : null}
                  </TabHeading>
                }
              >
                <AppointmentList token={token}/>
              </Tab>
            </Tabs>
            <DropdownAlert
              ref={(ref) => this.dropdown = ref}
              updateStatusBar={false}
              successColor={THEME.successAlert}
              messageStyle={CommonStyles.dropDownAlert}
              messageNumOfLines={5}
              elevation={5}
            />
          </Container>
          </DrawerLayoutAndroid>
      );
    } catch (error) {
      console.log(error, "crash->>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }
  }
}
