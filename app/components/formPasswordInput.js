import React, {Component} from 'react';
import {Icon, Input, Item, Label} from 'native-base';

export default class FormPasswordInput extends Component {
	constructor(props) {
    super(props);
    this.state = {
      showPassword: true
    };
  }

  render() {
  	return (
			<Item style = {{borderColor: "#b5b3b3",borderWidth: 1, borderRadius:5,marginBottom:10}}>
				<Icon active name='ios-lock' style={{fontSize: 30, paddingLeft: 15}}/>
				<Input 
						placeholder={this.props.placeholder} 
						placeholderTextColor="#b5b3b3"
						style={{fontSize: 20}} autoFocus = {false} secureTextEntry={this.state.showPassword}
						returnKeyType = {'send'}
						onChangeText={(text) => this.props.onTextChange(this.props.name, text)}
				/>
				<Icon
					active 
					name={(this.state.showPassword === true)? 'md-eye-off': 'md-eye'}
					style={{color: '#969494'}} 
					onPress={()=> this.setState({showPassword: !this.state.showPassword})}
				/>
			</Item>
  	);
  }
}