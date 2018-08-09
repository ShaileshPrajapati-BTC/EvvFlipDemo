import React,{Component} from 'react';
import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Badge,
  Icon,
  Card,
  Button,
  Item,
  Input,
} from 'native-base';

import {
  Platform,
  View,
  TouchableWithoutFeedback,
  TimePickerAndroid,
  Alert
} from 'react-native';

import CONFIG from '../../config/config.js';
import LableColor from '../../config/lableColor.js';
import TimePicker from '../../components/time_picker'
import Swipeable from 'react-native-swipeable';
import IosTimePicker from '../../components/ios_time_picker.js';
import moment from 'moment-timezone';
import Helper from '../../config/Helper.js';
import { NavigationActions } from 'react-navigation';

const noti_type = ['Incomplete','Resubmit'];

export default class NotificationListComponent extends Component {

  constructor(props) {
    super(props);
    this.state ={
      data: props.data,
      extra_hours_popup: false,
      notification_id: '',
      extra_hours: '',
      ios_time_picker: false,
      hours: 0,
      minute: 15,
      notification_type_id: null,
      timePicker:false
    };
    this.currentlyOpenSwipeable = null;
    this.location = {longitude: '', latitude: ''}
  }

  componentDidMount(){
    this._getLocationCoords()
  }

  componentWillReceiveProps() {
    this.setState({data: this.props.data});
  }

  _navigate(name, data) {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     visit_data: data
    //   }
    // })
    const navigateToScreen2 = NavigationActions.navigate({
      routeName: name,
      params: { visit_data: data }
    });
    this.props.navigation.dispatch(navigateToScreen2);
  }

  _getLocationCoords(){
    let permission = (this.props.location_permission === "while_in_use") ? "WhenInUse" : "Always"
    Helper.getCurrentLocation(permission,(position) => {
      console.log(position, "from method")
      this.location.longitude = position.coords.longitude;
      this.location.latitude = position.coords.latitude;
    },(error) =>{
      console.log(error, "from error method")
      this.location.longitude = '';
      this.location.latitude = '';
    });
  }

  _saveTimerClicked (hour, minute,notification_id,type) {
    // let hours = this._timeToDecimal(hour, minute);
    switch (type) {
      case 0: //extend hours
        // let format = (hours > 12)? 'PM' : 'AM'
        return(this._extendAppointment(notification_id, hour+':'+minute));
      case 1: //check_list finish time
        return(this.props.notification._interactionCheckList(notification_id, 10, hour+':'+minute, this.location));
      case 2: //running late before 30 min
        return(this.props.notification._visitStatusLocation(notification_id, 9, this.location, hour+":"+minute));
    }
  }

  async _openTimePicker(notification_id, check_list = false, type){
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: 0,
        minute: 0,
        is24Hour: false,
        mode: 'spinner'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        this._saveTimerClicked(Helper.padDigits(hour,2), Helper.padDigits(minute, 2),notification_id,type)
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  _validateTime = (hour, minute, total_hour) =>{
    let time = (total_hour > 12)? ' PM' : ' AM';
    hour = Helper.padDigits(hour,2);
    minute = Helper.padDigits(minute, 2);
    this._extendAppointment(this.state.notification_id, hour+':'+minute+' '+time);
    this.setState({ios_time_picker: false, hours:0, minute:15});
  }

  _validateTimeForCheckList = (hour, minute, total_hour) =>{
    console.log(hour,minute,total_hour,this.state.notification_id)
    this.props.notification._interactionCheckList(this.state.notification_id, 10, hour+':'+minute, this.location);
    this.setState({ios_time_picker: false, hours:0, minute:15, check_list: false});
  }

  _setTimeFor30Min = (hour, minute, total_hour) =>{
    this.props.notification._visitStatusLocation(this.state.notification_id, 9, this.location, hour+":"+minute)
    this.setState({ios_time_picker: false, hours:0, minute:15});
    console.log(hour,minute,total_hour,"setMin")
  }

  _timeToDecimal(hour, minute){
    let minute_to_hours = minute*(1/60);
    let hours = (hour + minute_to_hours);
    return (hours);
  }

  _checkLeftType(data){
    console.log(data,"0");
    switch (data.notification_type) {
      case 1:
        return(this._onDashboardCommentLeftButtons(data)); // dashboard comment
    }
  }

  _checkType(data){
    switch (data.notification_type) {
      case 0:
        return(this._extendButtons(data)); // Extend hours
      case 1:
        return(this._onDashboardCommentButtons(data)); // dashboard comment
      case 3:
        return(this._visitStatus(data)); //30 min before app
      case 5:
        return (this._interactionButton(data));
    }
  }

  _basedOnNotificationHoursPopupForIos(type){
    switch (type) {
      case 0: //extend hours
        return (this._validateTime);
      case 1: //check_list finish time
        return (this._validateTimeForCheckList);
      case 2: //running late before 30 min
        return (this._setTimeFor30Min)
    }
  }

  _showPopup(notification_id, check_list = false, notification_type){
    if(Platform.OS === 'ios'){
      this.setState({
        ios_time_picker: true,
        notification_id: notification_id,
        check_list: check_list,
        notification_type_id: notification_type});
    }else{
      this._openTimePicker(notification_id, check_list, notification_type);
    }
  }
  
  _showTimePicker = (notification_id, check_list = false, notification_type) => {
    this.setState({timePicker:true,notification_id:notification_id})
  }

  _resetPopup(){
    this._extendAppointment(this.state.notification_id, this.state.extra_hours)
  }

  _extendAppointment(id, hours, refused=false){
    let date_time = moment().format("YYYY-MM-DD")+' '+hours;
    let extend_time = (refused === true) ? 0 : moment(date_time, 'YYYY-MM-DD hh:mm:ss a').unix()
    this.props.notification._extendAppointment(id, extend_time, refused)
  }

  _badgeColor(data){
    if (data.response_status.includes("Extended"))
      return LableColor['Yes'];
    else
      return LableColor[data.response_status];
  }

  checkIncompleteVisit(data){
    if(data.read_status === true && noti_type.includes(data.response_status) && data.notification_type === 4){
      this._navigate('IncompleteCarePlan', data)
    }else if(data.read_status === false && data.response_status === 'Inprocess' && data.notification_type === 6){
      this._navigate('LiveInCarePlan', data)
    }
  }

  _pickTimeForChecklist(data){
    Alert.alert(
      '',
      "When did you finish this task?",
      [
        {text: 'Cancel'},
        {text: 'Select Time', onPress: () => this._showPopup(data.id, true, 1), style: 'ok'}
      ],
      { cancelable: false }
    )
  }
//12 AM PM Picker
  _interactionButton(data){
    let buttons =[
      <TouchableWithoutFeedback onPress={() => this.props.notification._interactionCheckList(data.id, 10, 0, this.location)}>
        <View style={{flex: 1,backgroundColor: '#4CAF50',justifyContent: 'center',height: 100}}>
          <Icon name='md-checkmark-circle' style={styles.button_icon}/>
          <Text style={{marginLeft:30, color: 'white'}}>Yes</Text>
        </View>
      </TouchableWithoutFeedback>,
      <TouchableWithoutFeedback onPress={() => this.props.notification._interactionCheckList(data.id, 11, 0, this.location)}>
        <View style={{flex: 1, backgroundColor: '#F44336',justifyContent: 'center',height: 100}}>
          <Icon name='md-close-circle' style={styles.button_icon}/>
          <Text style={{marginLeft: 30, color: 'white'}}>Not Yet</Text>
        </View>
      </TouchableWithoutFeedback>]
    return buttons ;
  }

  _extendButtons(data){
    let buttons =[
      <TouchableWithoutFeedback onPress={() => this._showPopup(data.id,false,0)}>
        <View style={{flex: 1,backgroundColor: '#4CAF50',justifyContent: 'center',height: 100}}>
          <Icon name='md-checkmark-circle' style={styles.button_icon}/>
          <Text style={{marginLeft:30, color: 'white'}}>Yes,</Text>
          <Text style={{marginLeft:15, color: 'white'}}>Extend it</Text>
        </View>
      </TouchableWithoutFeedback>,
      <TouchableWithoutFeedback onPress={() => this._extendAppointment(data.id, 0, true)}>
        <View style={{flex: 1, backgroundColor: '#F44336',justifyContent: 'center',height: 100}}>
          <Icon name='md-close-circle' style={styles.button_icon}/>
          <Text style={{marginLeft: 30, color: 'white'}}>No</Text>
        </View>
      </TouchableWithoutFeedback>]
    return buttons ;
  }

  //input box
  _visitStatus(data){
    let buttons =[
      <TouchableWithoutFeedback onPress={() => this.props.notification._visitStatusLocation(data.id, 8, this.location)}>
        <View style={{flex: 1,backgroundColor: '#4CAF50',justifyContent: 'center',height: 100}}>
          <Icon name='md-checkmark-circle' style={styles.button_icon}/>
          <Text style={{marginLeft:10, color: 'white', fontSize:14 }}>On My Way</Text>
        </View>
      </TouchableWithoutFeedback>,
      <TouchableWithoutFeedback onPress={() => this._showTimePicker(data.id, false, 2)}>
        <View style={{flex: 1, backgroundColor: '#F44336',justifyContent: 'center',height: 100}}>
          <Icon name='md-close-circle' style={styles.button_icon}/>
          <Text style={{marginLeft: 5, color: 'white', fontSize:14}}>Running Late</Text>
        </View>
      </TouchableWithoutFeedback>]
    return buttons ;
  }

  _onDashboardCommentLeftButtons(data){
    let buttons = [
      <TouchableWithoutFeedback onPress={() => this.props.notification._updateNotification(data.id, 13)}>
        <View style={{flex: 1, backgroundColor: '#d74338',justifyContent: 'center',height: 100,alignItems: 'flex-end'}}>
          <Icon name='ios-trash' style={styles.left_button_icon}/>
          <Text style={{marginRight:15,fontSize:14, color: 'white'}}>Clear</Text>
        </View>
      </TouchableWithoutFeedback>
    ]
    return buttons;
  }
  _onDashboardCommentButtons(data){
    let buttons =[
      <TouchableWithoutFeedback onPress={() => this.props.notification._updateNotification(data.id, 1)}>
        <View style={{flex: 1, backgroundColor: '#9E9E9E', justifyContent: 'center',height: 100}}>
          <Icon name='call' style={styles.button_icon}/>
          <Text style={{marginLeft: 20, fontSize:14, color: 'white'}}>Call Me</Text>
        </View>
      </TouchableWithoutFeedback>,
      <TouchableWithoutFeedback onPress={() => this.props.notification._updateNotification(data.id, 2)}>
        <View style={{flex: 1, backgroundColor: '#FF9800',justifyContent: 'center', height: 100}}>
          <Icon name='md-alarm' style={styles.button_icon}/>
          <Text style={{marginLeft:5, color: 'white', fontSize:14}}>Running late</Text>
        </View>
      </TouchableWithoutFeedback>,
      <TouchableWithoutFeedback onPress={() => this.props.notification._updateNotification(data.id, 3)}>
        <View style={{flex: 1, backgroundColor: '#8BC34A',justifyContent: 'center',height: 100}}>
          <Icon name='md-walk' style={styles.button_icon}/>
          <Text style={{marginLeft: 10, fontSize:14, color: 'white'}}>On my way</Text>
        </View>
      </TouchableWithoutFeedback>]
    return buttons ;
  }

  _extenedNotificationMessage(data){
    return(
      <Text style={{fontSize: 14}}>
        {data.message.substr(0,data.message.lastIndexOf(data.client_name))}
        <Text style={{fontWeight: 'bold', fontSize: 14}}>{data.client_name}</Text>
        <Text style={{fontSize: 14}}>?</Text>
      </Text>
    )
  }
  _defalutNotificationMessage(message){
    return(
      <Text style={{fontSize: 14}}>{message}</Text>
    )
  }
  _messageBody(data){
    switch (data.notification_type){
      case 0:
        return(this._extenedNotificationMessage(data))
      case 3:
        if(data.utc_time_fields.message_typo != undefined ){
          let data_message = data.utc_time_fields.message_typo
          let greeting_msg = Helper._greetingText(moment.unix(data.utc_time_fields.greeting_time).tz(moment.tz.guess()).hours());
          data_message = data_message.replace('%{greetings}', greeting_msg)
          return(this._defalutNotificationMessage(data_message))
        }else{
          return(this._defalutNotificationMessage(data.message))
        }
      case 8:
        console.log(data.utc_time_fields)
        let message = data.utc_time_fields.message_typo
        if(data.utc_time_fields.status === "normal_visit"){
          message = Helper.findAndReplaceString(message, '%{old_value}', data.utc_time_fields.old_value)
          message = Helper.findAndReplaceString(message, '%{new_value}', data.utc_time_fields.new_value)
        }else{
          message = Helper.findAndReplaceString(message, '%{end_time}', data.utc_time_fields.end_time, "h:mm A")
        }
        return(this._defalutNotificationMessage(message))
      default:
        return(this._defalutNotificationMessage(data.message))
    }
  }

  _notificationList(data){
    return(
      <Card style={{borderColor:'transparent',flexWrap: 'nowrap'}}>
        <List key={data.id}>
          <ListItem
            onPress={() => this.checkIncompleteVisit(data)}
            avatar key={'item'+data.id}
            style={{borderWidth:0, borderColor:'transparent'}}
          >
            <Left key={'left'+data.id}>
              <Thumbnail medium source={{uri: data.client_image}} />
            </Left>
            <Body style={{paddingBottom: 22, borderBottomWidth: 0}} key={'body'+data.id}>
            {(data.prepender != null) ?
              <Text style={{fontSize: 14}}>{data.prepender}<Text style={{fontWeight: 'bold', fontSize: 14}}>{data.client_name}</Text></Text> : null }
              {this._messageBody(data)}
            <Text note style={{fontSize: 14, marginTop: 5}}>From: {data.sender_name}</Text>
            </Body>
            <Right style={{justifyContent: 'space-between', paddingRight:8, borderBottomWidth: 0}} key={'right1'+data.id}>
              {(data.response_status != 'Pending')?
                <View style = {{flexDirection: 'column'}}>
                  <Text style={{fontSize: 14, fontWeight: 'bold', color: this._badgeColor(data)}}>
                    {data.response_status}
                  </Text>
                  <Text style={{fontSize: 10,color:CONFIG.theme_color,alignSelf: 'flex-end'}}>
                  {data.running_late_by}</Text>
                </View>
                : null}
              {(data.response_status != 'Pending')?
                <Text note style={{fontSize: 14,flex: 0, alignSelf: 'flex-end', marginTop: 5, marginLeft:5}}>
                  {moment(data.time,"MM/DD/YYYY HH:mm A Z").fromNow()}
                </Text> : null}
            </Right>
            {(data.response_status === 'Pending')?
              <Right style={{justifyContent: 'center', paddingRight:8, borderBottomWidth: 0}} key={'right2'+data.id}>
                <Icon key={'icon'+data.id} name='ios-arrow-forward' style={{color: '#607D8B'}}/>
                <Text note style={{fontSize: 14,flex: 0, alignSelf: 'flex-end', marginTop: 5, marginLeft:5}}>
                  {moment(data.time,"MM/DD/YYYY HH:mm A Z").fromNow()}
                </Text>
              </Right> : null}
          </ListItem>
        </List>
      </Card>
    )
  }

  onOpen(swipe){
    if (this.currentlyOpenSwipeable && this.currentlyOpenSwipeable !== swipe) {
      this.currentlyOpenSwipeable.recenter();
    }
    this.currentlyOpenSwipeable = swipe;

  }
  onClose(){
    this.currentlyOpenSwipeable = null;
  }

  _renderNotificationList() {
    return this.state.data.map((data, index) => {
      let list_element =  this._notificationList(data);
      if (data.read_status === false){
        return (
          <Swipeable
            key={index}
            rightButtonContainerStyle={{top:5,bottom:5}}
            leftButtonContainerStyle={{top:5,bottom:5}}
            rightButtonWidth={90}
            leftButtonWidth={60}
            rightButtons={this._checkType(data)}
            leftButtons={this._checkLeftType(data)}
            onRef={ref => this.swipeable = ref}
            onRightButtonsOpenRelease={(event, gestureState, swipe) => this.onOpen(swipe)}
            onRightButtonsCloseRelease={() => this.onClose()}
            onLeftButtonsOpenRelease={(event, gestureState, swipe) => this.onOpen(swipe)}
            onLefttButtonsCloseRelease={() => this.onClose()}
          >
            {list_element}
          </Swipeable>
        )
      }else{
        return(list_element)
      }
    })
  }

  _renderPopup(){
    if (this.state.ios_time_picker){
      return(
        <IosTimePicker
          ios_time_picker={this.state.ios_time_picker} is24hour={true} cancelClicked={this._cancelPickerClicked}
          onTimeChange={this._basedOnNotificationHoursPopupForIos(this.state.notification_type_id)}
        />
      );
    }else{
      return (<View/>);
    }
  }

  _cancelPickerClicked = () => {
    this.setState({
      ios_time_picker:false
    })
  }

  _cancelClicked = () => {
    this.setState({
      timePicker:false
    })
  }

  _renderTimePicker(){
    if(this.state.timePicker)
      return(
        <TimePicker 
          title={"How much time will it take to reach?"}
          isFromNotification={true}
          cancelClicked={this._cancelClicked}
          ios_time_picker={this.state.timePicker}
          onTimeChange={this._setTimeFor30Min}
        />
      )
    else return(
      <View/>
    )
  }

  render() {
    return(
      <View style={{marginTop: 10}} key={'Main'}>
        {this._renderNotificationList()}
        {this._renderPopup()}
        {this._renderTimePicker()}
      </View>
    )
  }
}

let styles = {
  contentStyle: {
    flex: 1 ,
    justifyContent: 'center',
    alignSelf: 'center',
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
    fontSize: 100,
    marginBottom: 20
  },
  close_button:{
    flex: 1,
    marginBottom:5,
    left:20,
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },
  button_icon:{
    fontSize: 18,
    color: 'white',
    marginLeft: 40
  },
  left_button_icon:{
    fontSize: 18,
    color: 'white',
    marginRight: 28
  }
};