import React, {Component} from 'react';
import {Content, Icon, Spinner, Text,} from 'native-base';

import {Dimensions, Image, ImageBackground, View} from 'react-native';

import CONFIG from '../config/config.js';
import Helper from '../config/Helper.js';

export default class BeaconFind extends Component {


  constructor(props) {
    super(props);
    this.state = {
      greeting: ''
    };
  }

  componentWillMount(){
    const greeting= Helper._greetingText();
    this.setState({greeting: greeting})
  }
  
  render() {
    return (
      <ImageBackground 
        source={require('../images/bf.png')}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center', width:Dimensions.get("window").width}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{marginBottom: 50}}>
            <Text style={styles.boldTextStyle}> 
              {this.state.greeting}
            </Text>
          </View>
          <Image 
            style={{alignSelf: 'center', width: 180,height: 180}} 
            source={require('../images/beacon_find.png')}/>
          <View style={{marginBottom: 20,marginTop:30}}>
            <Text style={styles.blackTextStyle}>
              Welcome to EVV systems!
            </Text>
            <Text style={styles.grayTextStyle}>
              Start Managing your work
            </Text>
            <Text style={styles.grayTextStyle}>
              quickly and efficently
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
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
    fontSize: 40, 
    alignSelf: 'center',
    color: '#3f3f3f',
    fontFamily: 'OpenSans'
  },
  blackTextStyle: {
    marginBottom: 10, 
    fontSize: 22, 
    alignSelf: 'center',
    fontFamily: 'OpenSans'
  },
  grayTextStyle: {
    marginBottom: 4, 
    fontSize: 20, 
    color: '#7a7a7a',
    alignSelf: 'center',
    fontFamily: 'OpenSans'
  },
  smsIcon: {
    color: CONFIG.theme_color, 
    alignSelf: 'center', 
    fontSize: 100, 
    marginBottom: 20,
  }
};