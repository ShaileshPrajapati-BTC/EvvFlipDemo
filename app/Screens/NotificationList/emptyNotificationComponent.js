import React, {Component} from 'react';
import {Content, Icon, Spinner, Text} from 'native-base';

import {View} from 'react-native';

import CONFIG from '../../config/config.js';

export default class NoNotification extends Component {
  render() {
    return (
      <View style={{marginBottom: 40}}>
        <Icon 
          name="md-notifications-outline" 
          style={styles.smsIcon}
        />
        <View style={{marginBottom: 20}}>
          <Text style={styles.boldTextStyle}> 
            No Notification... Yet!
          </Text>
        </View>
        <View style={{marginBottom: 20}}>
          <Text style={styles.grayTextStyle}>
            Refersh the notification screen
          </Text>
          <Text style={styles.grayTextStyle}>
            and check again.
          </Text>
        </View>
      </View>
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
  }
};