import React, {Component} from 'react';
import {Body, Button, Container, Content, Icon, Left, List, ListItem, Right, Switch, Text} from 'native-base';
import CONFIG from '../../config/config.js';
import {StatusBar, View} from 'react-native';

import Header from '../../components/back_header.js';
import Permissions from 'react-native-permissions';
import OpenAppSettings from 'react-native-app-settings'

export default class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      camera_permission: false,
      location_permission: false,
      notification_permission: false
    };
  }

  componentWillMount() {
    this._checkCameraAndLocation();
  }
  _openSettings(){
    OpenAppSettings.open();
  }

  _checkCameraAndLocation() {
    // Permissions.getPermissionStatus('camera')
    //   .then(response => {
    //     console.log("permission       ======", response);
    //     if(response.camera === 'authorized'){
    //       this.setState({camera_permission: true})
    //     }
    //     if(response.location === 'authorized'){
    //       this.setState({location_permission: true})
    //     }
    // });
    Permissions.getPermissionStatus('camera')
      .then(response => {
        if (response !== 'authorized'){
          // this._requestForPermissions();
        }else{
          this.setState({camera_permission: true});
        }
      });
    Permissions.getPermissionStatus('location')
      .then(response => {
        if (response !== 'authorized'){
          // this._requestForPermissions();
        }else{
          this.setState({location_permission: true});
        }
      });
    // if (Platform.os == 'ios'){
    //   Permissions.getPermissionStatus('notification')
    //     .then(response => {
    //       if (response != 'authorized'){
    //           // this._requestForPermissions();
    //       }else{
    //         this.setState({notification_permission: true});
    //       }
    //   });
    // }else{
    //   this.setState({notification_permission: true});
    // }
  }

  render() {
    return (
      <View style={{flex:1,justifyContent: 'center', backgroundColor: 'white'}}>
        <Header
          navigator={this.props.navigation}
          ref={(header) => { this.header = header; }}
          title="Settings"
        />
        <StatusBar backgroundColor={CONFIG.theme_color} />
        <Content >
          <List>
            <ListItem icon style={{marginTop: 10}} onPress={ () => this._openSettings() }>
              <Left>
                <Icon name="md-camera" style={{color: CONFIG.theme_color}}/>
              </Left>
              <Body>
              <Text>Camera</Text>
              </Body>
              <Right>
                <Icon
                  name={this.state.camera_permission ? "md-checkmark-circle" : "md-close-circle"}
                  style={{color: this.state.camera_permission ? 'green': 'red', fontSize: 30}}/>
              </Right>
            </ListItem>
            <ListItem icon onPress={ () => this._openSettings() }>
              <Left>
                <Icon name="md-pin" style={{color: CONFIG.theme_color}}/>
              </Left>
              <Body>
              <Text>Location</Text>
              </Body>
              <Right>
                <Icon
                  name={this.state.location_permission ? "md-checkmark-circle" : "md-close-circle"}
                  style={{color: this.state.location_permission ? 'green': 'red', fontSize: 30}}/>
              </Right>
            </ListItem>
            {/*            <ListItem icon onPress={ () => this._openSettings() }>
                          <Left>
                            <Icon name="md-notifications" style={{color: CONFIG.theme_color}}/>
                          </Left>
                          <Body>
                            <Text>Notification</Text>
                          </Body>
                        <Right>
                          <Icon
                            name={this.state.notification_permission ? "md-checkmark-circle" : "md-close-circle"}
                            style={{color: this.state.notification_permission ? 'green': 'red', fontSize: 30}}/>
                        </Right>
                        </ListItem>*/}
          </List>
        </Content>
      </View>
    );
  }
}