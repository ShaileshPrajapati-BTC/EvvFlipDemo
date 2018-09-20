import React, {Component} from 'react';
import {
  Badge,
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
  Switch,
  Tab,
  TabHeading,
  Tabs,
  Text,
  Thumbnail,
  Title
} from 'native-base';

import {Alert, Image, Platform, View,ImageBackground} from 'react-native';

import CONFIG from '../../config/config.js';
import Helper from '../../config/Helper.js';
import THEME from '../../config/theme.js';
import CommonStyles from '../../config/commonStyle.js';

export default class SideMenu extends Component {

  constructor(props) {
    super(props);
    this.state ={
      side_menu: false
    };
  }
  componentWillReceiveProps(){
    this.setState({side_menu: this.props.side_menu})
  }

  componentWillMount(){
  }

  componentDidMount() {
    this.setState({side_menu: this.props.side_menu})
  }

  _confirmation_for_logout(){
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.props.logout._logout()},
      ],
      { cancelable: false }
    )
  }
  _navigate(name) {
    this.props.closeDrawer();

    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     log_out: this.props.log_out_after_reset_pass,
    //     visit_data: null
    //   }
    // });
    this.props._navigate(name,{log_out: this.props.log_out_after_reset_pass, visit_data: null})
  }

  _logout(){
    this.props.closeDrawer();
    this.props.log_out();
  }

  _checkVisitStatus(){
    if(this.props.userData.in_out_status === 'In'){
      this.props.closeDrawer();
      Helper._alertPopup('Note', CONFIG.ongoing_visit);
    }else{
      this._navigate('RemoteCheckoutCheckList')
    }
  }

  render(){
    return(
      <View style={{flex:1,justifyContent: 'center', backgroundColor: THEME.themeColor}}>
        <Content >
            <ImageBackground source={{uri: 'https://www.botreetechnologies.com/img/team/header-bg.jpg'}} style={{flex:1,flexDirection:'row', backgroundColor:'transparent', height:100, padding:25}}>
              <Thumbnail small  source={{uri: this.props.profile}} style={{height: 50,width:50}}/>
              <View style={{marginLeft: 15, marginTop:5}}>
              <Text style={{color: THEME.textColor, fontSize:15}}>{`${this.props.name}`.substring(0,18)}</Text>
              <Text note style={{color: "#8A8581",fontSize:12}}>Caregiver</Text>
              </View>
            </ImageBackground>
          <List>
            {(this.props.userData.user_type === true) ?
              <ListItem icon  onPress={()=> this._navigate('RemoteCheckoutList')}>
                <Left>
                  <Icon name="ios-construct" style={{color: THEME.textColor}}/>
                </Left>
                <Body >
                <Text style={{color: THEME.textColor}}>Incomplete Visits</Text>
                </Body>
                <Right>
                  {(this.props.incomplete_count > 0)?
                    <View style={{height:22,width:22,justifyContent:'center',alignItems:'center',backgroundColor:'red',borderRadius:11}}>
                      <Text style={{fontSize:10,lineHeight:10, color:'white'}}>
                        {(this.props.incomplete_count > 9)? '+9' : this.props.incomplete_count}
                      </Text>
                    </View>: null}
                </Right>
              </ListItem>: null}
            {/*{(this.props.userData.user_type == true) ?
                  <ListItem icon  onPress={()=> this._navigate('ApprovedHours')}>
                    <Left>
                      <Icon name="md-done-all" style={{color: CONFIG.theme_color}}/>
                    </Left>
                    <Body>
                      <Text>Approved Hours</Text>
                    </Body>
                    <Right/>
                  </ListItem> : null}*/}
            {/*{(this.props.userData.user_type == true) ?
                  <ListItem icon  onPress={()=> this._navigate('PayrollHours')}>
                    <Left>
                      <Icon name="logo-usd" style={{color: CONFIG.theme_color}}/>
                    </Left>
                    <Body>
                      <Text>Payroll Hours</Text>
                    </Body>
                    <Right/>
                  </ListItem> : null}*/}
            <ListItem icon  onPress={()=> this._navigate('Telephony')}>
              <Left>
                <Icon name="md-call" style={{color: THEME.textColor}}/>
              </Left>
              <Body>
              <Text style={{color: THEME.textColor}}>Telephony</Text>
              </Body>
              <Right/>
            </ListItem>
            {(this.props.userData.unit_setup_accesible === true)?
            <ListItem icon  onPress={()=> this._navigate('InstallBeacon')}>
              <Left>
              <Icon name="md-qr-scanner" style={{color: THEME.textColor}}/>
              </Left>
              <Body>
              <Text style={{color: THEME.textColor}}>Unit Setup</Text>
              </Body>
              <Right/>
              </ListItem>: null}
            <ListItem icon  onPress={()=> this._navigate('Blog')}>
              <Left>
                <Icon name="md-paper" style={{color: THEME.textColor}}/>
              </Left>
              <Body>
              <Text style={{color: THEME.textColor}}>News</Text>
              </Body>
              <Right/>
            </ListItem>
            <ListItem icon  onPress={()=> this._navigate('ResetPassword')}>
              <Left>
                <Icon name="md-lock" style={{color: THEME.textColor}}/>
              </Left>
              <Body>
              <Text style={{color: THEME.textColor}}>Change Password</Text>
              </Body>
              <Right/>
            </ListItem>
            <ListItem icon  onPress={()=>this._navigate('Settings')}>
              <Left>
                <Icon name="md-settings" style={{color: THEME.textColor}}/>
              </Left>
              <Body>
              <Text style={{color: THEME.textColor}}>Settings</Text>
              </Body>
              <Right/>
            </ListItem>
            <ListItem icon  onPress={()=> this._navigate('Intro')}>
              <Left>
                <Icon name="md-help-circle" style={{color: THEME.textColor}}/>
              </Left>
              <Body>
              <Text style={{color: THEME.textColor}}>Help</Text>
              </Body>
              <Right/>
            </ListItem>
            <ListItem icon  onPress={()=> this._navigate('TermsAndCondition')}>
              <Left>
                <Icon name="md-document" style={{color: THEME.textColor}}/>
              </Left>
              <Body>
              <Text style={{color: THEME.textColor}}>Terms of Use</Text>
              </Body>
              <Right/>
            </ListItem>
            <ListItem icon  onPress={()=> this._logout()}>
              <Left>
                <Icon name="md-log-out" style={{color: THEME.textColor}}/>
              </Left>
              <Body>
              <Text style={{color: THEME.textColor}}>Logout</Text>
              </Body>
              <Right/>
            </ListItem>
          </List>
        </Content>
      </View>
    );
  }
}