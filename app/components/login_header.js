import React, {Component} from 'react';
import {Button, Header, Icon, Left, Right, Subtitle, Thumbnail, Title} from 'native-base';

import {Platform} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import CONFIG from '../config/config.js';

export default class BackHeader extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
  }

  _alert(msg){
    if (msg!=null){
      var title = msg.status === "success" ? "Thank you!" : ""
      this.dropdown.alertWithType(msg.status, title, msg.message);
    }  
  }

  render() {
    return (
        <Header style={styles.header}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={ () => this._back_press()} style={{height: 60}}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
            </Button>
          </Left>
            <Title style={styles.header_title}>{this.props.msg.title}</Title>
          <Right/>
          <DropdownAlert 
            ref={(ref) => this.dropdown = ref} 
            updateStatusBar={false} 
            successColor={CONFIG.success_color} 
            titleNumOfLines={0}
            messageStyle={{ fontSize: 13, textAlign: 'left', color: 'white', backgroundColor: 'transparent' }}
          />
        </Header>
    );
  }
}

let styles = {
  header: { 
    backgroundColor: CONFIG.theme_color, 
    height: (Platform.OS === 'ios') ? 64 : 54
  },
  header_title: {
    color: 'white', 
    marginTop: 15
  }
}