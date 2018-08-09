import React,{Component} from 'react';
import {
  Content, 
  Spinner,
  Text
} from 'native-base';
import CONFIG from '../config/config.js';

export default class Loading extends Component {
  render() {
    return (
        <Content contentContainerStyle={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
          <Spinner color= {CONFIG.theme_color}/>
          <Text style={{color: CONFIG.theme_color}}>Please wait...</Text>
        </Content>
    );
  }
}