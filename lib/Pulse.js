import React,{Component} from 'react';
import {
  Animated,
  Easing
} from 'react-native';

export default class Pulse extends Component {
  constructor(props) {
    super(props);
    this.pulseValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.pulseAnimation();
  }
  
  pulseAnimation(){
    this.pulseValue.setValue(0)
    Animated.timing(this.pulseValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.in
    })
    .start(this.pulseAnimation.bind(this));
  }
  
  render() {
    const pulseSize = this.props.pulseSize || 250
    return (
      <Animated.View 
        style={{
          position: 'absolute', 
          backgroundColor:'#7f7f7f',
          width: this.pulseValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, pulseSize]
                  }),
          height: this.pulseValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, pulseSize]
                  }),
          borderRadius: pulseSize/2,
          opacity: this.pulseValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                  })
        }}
      />
    );
  }
}