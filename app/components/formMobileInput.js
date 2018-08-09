import React,{Component} from 'react';
import {
  Item, 
  Input,
	Label,
	Icon
} from 'native-base';

export default class FormMobileInput extends Component {
	constructor(props) {
    super(props);
    this.state = {
      showPassword: true
    };
  }

  render() {
  	return (
      <Item style={{borderColor: "#b5b3b3",borderWidth: 1, borderRadius:5,marginBottom:10}} >
        <Icon active name='ios-call' style={{fontSize: 30, paddingLeft: 15}}/>
        <Input 
          maxLength={10} 
          placeholder={this.props.placeholder} 
          placeholderTextColor="#b5b3b3" 
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