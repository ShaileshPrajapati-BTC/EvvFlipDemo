import React,{Component} from 'react';
import {
  Content, 
  Spinner,
  Text
} from 'native-base';

import {View} from 'react-native';       
import CONFIG from '../config/config.js';

export default class NoData extends Component {
  render() {
    return (
        <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
          <Text style={{color: CONFIG.theme_color, alignSelf: 'center'}}>{this.props.message}</Text>
        </View>
    );
  }
}