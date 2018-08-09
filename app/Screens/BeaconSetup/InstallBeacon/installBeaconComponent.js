import Autocomplete from 'react-native-autocomplete-input';
import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Keyboard
} from 'react-native';
import { 
  Container, 
  Content,
  Text,
  Button,
  Spinner,
  Tab, 
  Tabs,
  TabHeading, 
  Icon,
  Left,
  Right,
  Thumbnail,
  Title,
  Form,
  Input,
  Item,
  List, 
  ListItem,
  Body,
  Switch 
} from 'native-base';
import {NavigationActions} from 'react-navigation';
import Header from '../../../components/back_header.js';
import CONFIG from '../../../config/config.js';
import Helper from '../../../config/Helper.js';

export default class InstallBeaconComponent extends Component{

  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      query: '',
      client_id: '',
      hide_list: false,
      scroll_height: null
    };
  }

  componentWillMount () {
    console.log("props",this.props)
    if(this.props.navigation.state.params.log_out !== undefined){
      this.props.resetSetupData()
    }
  }

  componentDidMount() {
    this.props.fetchLocation()
  }

  async _getClientList(query){
    console.log("query ----------------", this.state.query, query)
    let body = {
      query_string: query
    }
    this.props.fetchClientList(body)
    .then((responseData) =>
    {
      console.log("----------------------->")
      console.log(responseData);
      if (responseData.status === true){
        let height = (responseData.data.clients.length > 4) ? 180 : null
        console.log(height, "height        ------")
        if(this.state.query.length > 1){
          this.setState({clients: responseData.data.clients, scroll_height: height});
        }
      }else if (responseData.status === false){
        this.setState({clients: [], scroll_height: null});
      }
    })
    .catch((error) => {
      Helper.apiResponseAlert(error, CONFIG.get_client_list);
      console.log(error)
    });
  }

  _navigate(name, params) {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     params: params
    //   }
    // })
    const navigate = NavigationActions.navigate({
      routeName: name,
      params: params
    });
    this.props.navigation.dispatch(navigate);
    this.props.updateSetupData(params)
  }
  
  findClients(query) {
    console.log("query length", query, query.length)
    this.setState({query: query, client_id: '', hide_list: false});
    if (query.length <= 2) {
      console.log("query inside",query)
      this.setState({clients: []});
    }else{
      this._getClientList(query);
    }
  }

  _validate(route, params){
    if (this.state.query.length >= 1 && this.state.client_id === ''){
      this.header._alert({status: 'error', message: CONFIG.client_invalid_select});
    }else if(this.state.client_id === ''){
      this.header._alert({status: 'error', message: CONFIG.client_select});
    }else{
      this._navigate(route, params);
    }
  }

  _onClientSelection(title, id){
    this.setState({ query: title, client_id: id, hide_list: true });
    Keyboard.dismiss();
  }

  _nextButton(){
    return (
        <Button 
          style={native_base_style.button} 
          onPress={ () => 
            this._validate('ScanQrCode', {client_id: this.state.client_id, button: true, client_name: this.state.query}) }
          >
          <Text>NEXT</Text>
        </Button>
      )
  }

  _verifyButton(){
    return (
        <Button  
          style={native_base_style.button} 
          onPress={ () => this._validate('ScanQrCode', {client_id: this.state.client_id, button: false, client_name: this.state.query}) }>
          <Text>VERIFY UNIT SETUP</Text>
        </Button>
      )
  }

  render() {
    const { query } = this.state;
    const clients = this.state.clients;

    return (
          <View style={styles.container}>
            <Container>
              <Header 
                navigator={this.props.navigation}
                ref={(header) => { this.header = header; }} 
                show_back_button = {!this.props.button}
                title = "Unit Setup"
              />
              <StatusBar backgroundColor={CONFIG.theme_color} />
                  <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    data={clients}
                    defaultValue={query}
                    onChangeText={text => this.findClients(text)}
                    underlineColorAndroid='transparent'
                    listStyle={{margin:0, zIndex: 5, height: this.state.scroll_height}}
                    placeholder="Enter client name"
                    hideResults = {this.state.hide_list}
                    renderItem={({ fullname, avatar, client_id }) => (
                      <TouchableOpacity onPress={() => this._onClientSelection(fullname, client_id)}>
                        <View style={{flexDirection: 'row',margin: 5}}>
                          <Thumbnail source={{uri: avatar}} small style={{right: 4}}/>
                          <Text style={styles.itemText}>
                            {fullname}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                  {(this.props.button) ? this._nextButton() : this._verifyButton()}
            </Container>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  autocompleteContainer: {
    flex: 1,
    left: 20,
    position: 'absolute',
    right: 20,
    top: 100,
    zIndex: 5,
    elevation: 3,
  },
  itemText: {
    fontSize: 15,
    margin: 5
  },
  descriptionContainer: {
    backgroundColor: '#F5FCFF',
    marginTop: 25
  },
  infoText: {
    textAlign: 'center'
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center'
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center'
  },
  openingText: {
    textAlign: 'center'
  }
});

const native_base_style = {
    button: {
    justifyContent:'center',
    borderColor: CONFIG.theme_color, 
    backgroundColor: CONFIG.theme_color,
    borderRadius:10, 
    width:285,
    borderWidth:1,
    alignSelf: 'center',
    zIndex: -1,
    top: 150
  }
}