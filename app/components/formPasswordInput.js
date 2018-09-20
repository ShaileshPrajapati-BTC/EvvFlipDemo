import React, {Component} from 'react';
import {Icon, Input, Item, Label} from 'native-base';
import THEME from '../config/theme.js';

export default class FormPasswordInput extends Component {
	constructor(props) {
    super(props);
    this.state = {
      showPassword: true
    };
  }

  render() {
  	return (
			<Item style = {{borderColor: THEME.inputIconColor,borderWidth: 1, borderRadius:5,marginBottom:10}}>
				<Icon active name='ios-lock' style={{fontSize: 30, paddingLeft: 15, color: THEME.inputIconColor}}/>
				<Input 
						placeholder={this.props.placeholder} 
						placeholderTextColor={THEME.inputIconColor}
						style={{fontSize: 20, color:THEME.textColor}} 
						autoFocus = {false} secureTextEntry={this.state.showPassword}
						returnKeyType = {'send'}
						onChangeText={(text) => this.props.onTextChange(this.props.name, text)}
				/>
				<Icon
					active 
					name={(this.state.showPassword === true)? 'md-eye-off': 'md-eye'}
					style={{color: THEME.inputIconColor}} 
					onPress={()=> this.setState({showPassword: !this.state.showPassword})}
				/>
			</Item>
  	);
  }
}