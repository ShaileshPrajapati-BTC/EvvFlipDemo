import React, {Component} from 'react';
import {
  Body,
  Button,
  CheckBox,
  Container,
  Content,
  Header,
  Icon,
  Left,
  ListItem,
  Right,
  Spinner,
  Text,
  Title
} from 'native-base';

import {Platform, StatusBar, View, WebView} from 'react-native';
import { NavigationActions } from "react-navigation";

import CONFIG from '../../config/config.js';
import Helper from '../../config/Helper.js';
import Loading from '../../components/Loading.js';

export default class TermsAndCondition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accepted: false,
      canGoBack: true,
      url: '',
      loading: true
    };
  }

  componentDidMount() {
    console.log("ters----", this.props)
    this._getTermsAndConditionUrl();
  }

  _navigate(name, msg_obj) {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     msg: msg_obj
    //   }
    // })
    const navigate = NavigationActions.navigate({
      routeName: name,
      params: { msg: msg_obj }
    });
    this.props.navigation.dispatch(navigate);
  }

  _vaildate() {
    if (this.state.accepted === false) {
      alert("Please accept terms and conditions.")
    } else {
      this._updateStatus();
    }
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack
    });
  }

  onBack() {
    this.web.goBack();
  }

  _back() {
    // const routes = this.props.navigator.getCurrentRoutes();
    // const routeToGo = routes.find( route => route.name === 'TabList');
    this.props.navigation.goBack();
  }

  _checkBackPress() {
    if (this.state.canGoBack === true) {
      this.onBack()
    } else if (this.props.msg == null) {
      this._back()
    }
  }

  async _getTermsAndConditionUrl() {
    try {
      this.props.GetTermsAndConditionUrl({})
        .then((responseData) => {
          console.log("----------------------->")
          console.log(responseData);
          if (responseData.status === true) {
            this.setState({loading: false, url: responseData.data.terms_and_conditions_url});
          } else {
            this.setState({loading: false});
          }
        })
        .catch((error) => {
          Helper.apiResponseAlert(error, CONFIG.t_and_c_error);
          this.setState({loading: false});
        });
    } catch (error) {
      this.setState({loading: false});
    }
  }

  async _updateStatus() {
    this.setState({loading: true});
    let body = {
      accepted: this.state.accepted
    }
    this.props.UpdateTermsAndConditionUrl(body)
      .then((res) => {
        console.log(res);
        if (res.status === true) {
          this._navigate('TabList', {status: 'success', message: res.message});
        }
      }).catch((error) => {
      Helper.apiResponseAlert(error, CONFIG.t_and_c_submit_error);
      console.log(error)
    });
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: CONFIG.theme_color, height: (Platform.OS === 'ios') ? 74 : 64}}>
          {(this.state.canGoBack === true || this.props.msg == null) ? <Left style={{flex: 1}}>
            <Button transparent
                    onPress={this._checkBackPress.bind(this)}
                    style={{height: 60}}>
              <Icon name="arrow-back" style={{color: 'white'}}/>
            </Button>
          </Left> : <Left/>}
          <Body>
          <Text style={{color: 'white', fontSize: 13}}>Terms of Use</Text>
          </Body>
          <Right/>
        </Header>
        <StatusBar backgroundColor={CONFIG.theme_color}/>
        {(this.state.loading) ? <Loading/> :
          <View style={{flex: 1}}>
            <WebView
              style={{flex: 1}}
              ref={(ref) => this.web = ref}
              onNavigationStateChange={this.onNavigationStateChange.bind(this)}
              source={{uri: this.state.url}}
            />
            {(this.props.msg != null) ?
              <ListItem style={{backgroundColor: '#F5F5F5', marginLeft: 0}}>
                <CheckBox checked={this.state.accepted} style={{marginLeft: 5}}
                          onPress={() => this.setState({accepted: !this.state.accepted})}/>
                <Body>
                <Text
                  onPress={() => this.setState({accepted: !this.state.accepted})}
                  style={{fontWeight: 'bold', fontSize: 13}}>
                  I have read and agree to all the terms and conditions above.
                </Text>
                </Body>
                <Right>
                  <Text
                    onPress={() => this._vaildate()}
                    style={{fontWeight: 'bold', color: CONFIG.theme_color}}
                  >
                    Done
                  </Text>
                </Right>
              </ListItem> : null
            }
          </View>}
      </Container>
    );
  }
}
