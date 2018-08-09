import React, { Component } from 'react';
import Route from '../config/Routes.js';
import NavigationExperimental from 'react-native-deprecated-custom-components';

export default class NavigationRoot extends Component {
  constructor() {
    super();
  }
  _resetRoute(route){
    console.log(route,"--------------------------------------------------------")
    try{
      if (route.reset) {
        this.refs.navigator.immediatelyResetRouteStack([{ name: route.name }])
      }
    }catch(error){
      console.log("error in navigation", error);
    }   
  }
  render() {
    try{
     return (
          <NavigationExperimental.Navigator
            style={{ flex:1 }}
            ref={(nav) => { navigator = nav; }}
            initialRoute={{ name: 'Splash' }}
            renderScene={ Route.renderScene }
            onDidFocus={(route) => this._resetRoute(route)}
            onNavigate={this._handleNavigate}
            configureScene={(route, routeStack) => NavigationExperimental.Navigator.SceneConfigs.FadeAndroid}
          />
      );
    }catch(error){
      console.log(error,"crash->>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }
  }
}