import React, {Component} from 'react';
import {Content, Icon, Spinner} from 'native-base';

import {AsyncStorage, BackHandler, Platform, View} from 'react-native';

import CONFIG from '../../config/config.js';
import FCM, {
    FCMEvent,
    NotificationType,
    RemoteNotificationResult,
    WillPresentNotificationResult
} from 'react-native-fcm';
import { NavigationActions } from 'react-navigation';
let NotificationListener = null;

export default class PushNotification extends Component {

  constructor(props) {
    super(props);
    this.state ={};
  }

  componentWillMount(){}

  componentDidMount() {
    if (this.props.token!=null){
      this._setupNotification();
    }else{
      this._navigate('Login');
      console.log("no token");
    } 
    BackHandler.removeEventListener('hardwareBackPress',this._removePushnotificationLisntern);
    BackHandler.addEventListener('hardwareBackPress', this._removePushnotificationLisntern); 
  }

  _removePushnotificationLisntern(){
    if (NotificationListener != null){
      NotificationListener.remove()
      NotificationListener = null;
    }
    console.log("remove addEventListener-=")
  } 

  _checkFcmToken(token){
    AsyncStorage.getItem('fcm_token', (err, result) => {
      const fcm_token = result
      if (result!=null){
        if(token != fcm_token){
          this._updateFcmToken(token)
          console.log("Token changed =========================");
        }else{
          console.log("Token is Same ==========================");
        }
      }else{
        console.log("First time Token changed =========================");
        this._updateFcmToken(token);
      }
    });
  }
  _navigate(name, data = {}) {
    const navigate = NavigationActions.navigate({
      routeName: name,
      params: {visit_data: data}
    });
    this.props.navigation.dispatch(navigate);
  }

  _setupNotification(){
    this._requestForNotificationPermission();
    this._getFcmToken();
    this._setNotificationListner();
    this._refreshFcmToken();
    // this._presentNotification();
  }

  _requestForNotificationPermission(){
    FCM.requestPermissions().then(()=>console.log('granted')).catch(()=>console.log('notification permission rejected'));
  }

  _getFcmToken(){
    FCM.getFCMToken().then(token => {
      console.log("token",token)
      this._checkFcmToken(token);
    });
  }

  _checkNotificationType(notif, time){
    console.log(notif)
    if(notif.notification_type === "incomplete_visit"){
        setTimeout(() => {
          this._navigate('IncompleteCarePlan', notif);
        },time);
    }else{
      setTimeout(() => {
        this._navigate('Notification');
      },time);
    }
  }

  _checkRoutes(notif){
    const routes = this.props.navigation.state.routeName;
    console.log("current routes", routes)
    if (routes[routes.length-1].name === 'Qrcode'){
      this._checkNotificationType(notif, 1000)
    }else{
      console.log("ddd",notif)
      this._checkNotificationType(notif, 10)
      // this._navigate('CarePlan', notif);
    }
  }

  _setNotificationListner(){
    if(NotificationListener == null){
      NotificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
        console.log("remote notification", notif);
        if (notif.badge != null){
          FCM.setBadgeNumber(parseInt(notif.badge));
          console.log(notif.badge,"dsds")
        }
        if(this.props.notificationCount != null){
          this.props.notificationCount();
        }
        if(Platform.OS === 'ios' && notif.opened_from_tray){
          this._checkRoutes(notif);
        }else if(notif.opened_from_tray && notif.title != null)
        {
          console.log("When open ");
          this._checkRoutes(notif);
        }else if(notif.opened_from_tray && notif.notification_type != '' && notif.notification_type != null){
          console.log("when backgroound");
          this._checkRoutes(notif);
        }
        if(Platform.OS === 'ios'){
          switch(notif._notificationType){
            case NotificationType.Remote:
              notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
              break;
            case NotificationType.NotificationResponse:
              notif.finish();
              break;
            case NotificationType.WillPresent:
              notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
              break;
          }
        }else{
          this._presentLocalNotification(notif.fcm);
        }
      });
    }else{
      this._removePushnotificationLisntern();
      this._setNotificationListner();
    }
  }

  _refreshFcmToken(){
    FCM.on(FCMEvent.RefreshToken, (token) => {
      console.log("ref token", token)      
      this._checkFcmToken(token);
    });
  }

  _presentNotification(){}

  _presentLocalNotification(data){
    // if(this.props.token != ''){
      FCM.presentLocalNotification({
        title: (data.title != null) ? data.title : "EVV systems",
        body: data.body,
        sound: "default",
        priority: "high",
        icon: "ic_notification",
        large_icon: (Platform.OS === 'android' && Platform.Version > 23) ? "ic_notification" : "ic_launcher",
        vibrate: 300,
        show_in_foreground: true,
        group: "group",
        color: 'white'
      });
    // }    
  }

  async _updateFcmToken(fcm_token){
    this.setState({disabled: true})
    try {
      let response = await fetch(CONFIG.BASE_URL+'fcm/save_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'access_token': this.props.token
        },
        body: JSON.stringify(
        {
          token: fcm_token,
        })
      }).then(function(res){ return res.json(); })
        .then(function(data){
          let res =  data;
          console.log(res);
          if (res.status === 404 || res.status === 500){
            console.log("unable to update")
          }
          else if (res.status === true)
          {
            console.log("success updated fcm token");
            AsyncStorage.setItem('fcm_token', fcm_token);
          }
        }).catch(function(error) {
          console.log(error,"inside update token method")
        });

    } catch(error) {
      console.log(error, "==========> update token");
    }
  }
  render() {
    return (
      <View/>
    );
  }
}