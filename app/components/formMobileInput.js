import React,{Component} from 'react';
import {
  Item, 
  Input,
	Label,
	Icon
} from 'native-base';
import THEME from '../config/theme.js';

export default class FormMobileInput extends Component {
	constructor(props) {
    super(props);
    this.state = {
      showPassword: true
    };
  }

  render() {
  	return (
      <Item style={{borderColor: THEME.inputIconColor,borderWidth: 1, borderRadius:5,marginBottom:10}} >
        <Icon active name='ios-call' style={{fontSize: 30, paddingLeft: 15, color: THEME.inputIconColor}}/>
        <Input 
          maxLength={10} 
          placeholder={this.props.placeholder} 
          placeholderTextColor={THEME.textColor} 
          style={{fontSize: 20}} 
          keyboardType="numeric" 
          autoFocus = {false} 
          value = {this.props.value}
          onChangeText={(text) => this.props.onTextChange(this.props.name, text)}
      />
      </Item>
  	);
  }
}