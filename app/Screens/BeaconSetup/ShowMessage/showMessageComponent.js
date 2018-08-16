import React,{Component} from 'react';
import {
  Container,
  Content, 
  Spinner,
  Text,
  Icon,
  Button
} from 'native-base';

import {
  View, 
  StatusBar,
} from 'react-native';

import CONFIG from '../../../config/config.js';
import Header from '../../../components/back_header.js';
import Helper from '../../../config/Helper.js';
import Loading from '../../../components/Loading.js';
import { NavigationActions } from 'react-navigation';

export default class ShowMessage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirm_disabled: false,
      verification_icon: true,
      verification_message: '',
      loading: true
    };
  }

  componentWillReceiveProps(){
    console.log(" data", this.props)
  }

  componentWillMount() {
    console.log(" data", this.props)
    if (this.props.button === false) {
      setTimeout(() => {
        this._verifyClientBeacon();
      }, 500);
    }
  }

  componentDidMount(){
    console.log("states", this.state);
  }
  
  _navigate(name, params) {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     params: params
    //   }
    // })
    const navigate = NavigationActions.navigate({
      routeName: name,
      params: params
    });
    this.props.navigation.dispatch(navigate);
  }

  _goBack(){
    this.header._back_press();
    setTimeout(() =>{
      this.props.resetSetupData();
    }, 500)
  }

  async _updateClientBeacon(){
    this.header._alert({status: 'success', message: "Unit updated successfully!!"});
    this.setState({confirm_disabled: false});
    this.props.BeaconSetupDataChange('button', false);
    setTimeout(() => {
      this._navigate('InstallBeacon', {fromShow: true});
    }, 1500);
  }

  async _verifyClientBeacon(){
    this.setState({verification_icon: true, verification_message: "Unit verified successfully!!", loading: false}); 
  }

  _renderConfirm(){
    return (
      <View>
        <Icon name='md-alert' style={styles.warning_Icon}/>
        <View style={{marginBottom: 15}}>
          <Text style={styles.grayTextStyle}>
            Unit linked
          </Text>
        </View>
        <View style={{marginBottom: 15}}>
          <Text style={styles.grayTextStyle}>
          If this is correct, please click Confirm.
          </Text>              
        </View>
        <Button
          style={styles.confirm_button}
          onPress={ () => this._updateClientBeacon() }
          disabled={this.state.confirm_disabled}
        >
          {(this.state.confirm_disabled)? <Spinner color='#ffffff'/> : <Text>CONFIRM</Text> }
        </Button>
      </View>
    );
  }
  
  _renderSuccessfullyVerified(){
    if(this.state.loading){
      return(
        <Loading/>
      );
    }else{
      return (
        <View>
          {
            (this.state.verification_icon) ? 
              <Icon name='md-checkmark-circle' style={styles.success_Icon}/> : 
              <Icon name='md-close-circle' style={styles.error_Icon}/>
          }
          <View style={{marginBottom: 15}}>
            <Text style={styles.grayTextStyle}>
              {this.state.verification_message}
            </Text>
          </View>
          <Button
            style={styles.confirm_button}
            onPress={ () => this._goBack() }
          >
            <Text>OK</Text>
          </Button>
        </View>
      );
    }
  }

  render() {
    return (
        <Container>
          <Header 
            navigator={this.props.navigation}
            ref={(header) => { this.header = header; }} 
            beacon_setup = {this.props.button}
            title = {(this.props.button) ? "Confirm Unit" : "Verification"}
            show_back_button = {!this.props.button}
          />
          <StatusBar backgroundColor={CONFIG.theme_color} />
          <Content 
            contentContainerStyle={{flex: 1,justifyContent: 'center',alignItems: 'center'}} 
            extraScrollHeight={250} 
            disableKBDismissScroll={true}
          >
            {(this.props.button) ? this._renderConfirm() : this._renderSuccessfullyVerified()}
          </Content>
        </Container>
    );
  }
}

let styles = {
  grayTextStyle: {
    marginBottom: 5, 
    fontSize: 14, 
    color: '#a8a8a8',
    alignSelf: 'center'
  },
  boldTextStyle: {
    marginBottom: 5, 
    fontSize: 16, 
    alignSelf: 'center',
    color: '#3f3f3f'
  },
  warning_Icon: {
    color: '#F4D03F', 
    alignSelf: 'center', 
    fontSize: 150, 
    marginBottom: 20
  },
  success_Icon: {
    color: CONFIG.success_color, 
    alignSelf: 'center', 
    fontSize: 150, 
    marginBottom: 20
  },
  error_Icon: {
    color: CONFIG.error_color, 
    alignSelf: 'center', 
    fontSize: 150, 
    marginBottom: 20
  },
  confirm_button: {
    justifyContent:'center',
    borderColor: CONFIG.theme_color, 
    backgroundColor: CONFIG.theme_color,
    borderRadius:10, 
    marginTop: 25, 
    marginBottom: 20, 
    width:285,
    borderWidth:1,
    alignSelf: 'center'
  }
};