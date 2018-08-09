import React,{Component} from 'react';
import { 
  Container, 
  Content, 
  List, 
  ListItem, 
  Left, 
  Body, 
  Right, 
  Thumbnail, 
  Text,
  Badge,
  Icon,
  Card
} from 'native-base';

import {
  StatusBar,
  RefreshControl,
  FlatList
} from 'react-native';       

import CONFIG from '../../config/config.js';
import LableColor from '../../config/lableColor.js';
import Nodata from '../../components/no_data.js';
import Loading from '../../components/Loading.js';
import Helper from '../../config/Helper.js';
import Header from '../../components/back_header.js';   
import moment from 'moment-timezone';
import { NavigationActions } from "react-navigation";

export default class RemoteCheckoutList extends Component {

  constructor(props) {
    super(props);
    this.state ={
      loading: true,
      refreshing: false,
    };
  }

  componentDidMount() {}
  
  componentWillMount(){
    console.log(this.props,"incomplete visit data")
    this._getIncompleteVisitList()
  }

  _getIncompleteVisitList = async () => {
    try{
      this.props.fetchIncompleteAppointmentList()
      .then((responseData) =>
      {
        console.log(responseData, "visits------");
        this.setState({loading: false});
      })
      .catch((error) => {
        Helper.apiResponseAlert(error, CONFIG.get_incomplete_list);
        console.log(error)
        this.setState({loading: false});
      });
    } catch(error){}
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._getIncompleteVisitList().then(() => {
      this.setState({refreshing: false});
    });
  }  

  _navigate(name, data) {
    // this.props.navigator.push({
    //   name: name,
    //   passProps: {
    //     visit_data: data
    //   }
    // })
    const navigate = NavigationActions.navigate({
      routeName: name,
      params: { visit_data: data }
    });
    this.props.navigation.dispatch(navigate);
  }

  _appointmenStyle(data){
    if (data.length> 0){
     return {}
    }else{
      return {flex: 1, justifyContent: 'center', alignItems: 'center'}
    }
  }

  _checkVisit(data){
    if(data.status != 'Need Approval'){
      this._navigate('IncompleteCarePlan', data)
    }
  }
  
  _listItem = (data) => {
    return(
      <ListItem  avatar onPress={()=> this._checkVisit(data)}>
        <Left >
          <Thumbnail  medium source={{uri: data.client_image}} />
        </Left>
        <Body  style={{flex:2,paddingBottom: 22, borderBottomWidth: 0}}>
          <Text  style={{fontSize: 14}}>{data.client_name}</Text>
          <Text note style={{fontSize: 12, color: '#b2b2b2'}}>
            <Icon name="md-time" style={{fontSize: 12, color: '#b2b2b2'}}/>
            {Helper.timeZoneConvert(data.utc_start_time, data.utc_end_time)}
          </Text>
        </Body>
        <Right style={{borderBottomWidth: 0}}>
          <Badge  style={{ backgroundColor: LableColor[data.status], borderRadius:5 }}>
            <Text  style={{fontSize: 13}}>{data.status}</Text>
          </Badge>
          {(data.extended_hours != '') ?
            <Text note style={{fontSize: 10, marginTop: 5, color: CONFIG.theme_color}}>{data.extended_hours}</Text> : null}
            <Text note style={{fontSize: 10, marginTop: 5, color: CONFIG.theme_color}}>
              {data.visit_type_status}</Text>
        </Right>
      </ListItem>
    )
  }

  _renderIncompleteVisitList = (data) => {
    return (
      <Card style={{flexWrap: 'nowrap'}} >
        <ListItem itemDivider  style={{backgroundColor: '#E8EAF6'}}>
          <Text>{moment(data[0]).format("MM/DD/YYYY")}</Text>
        </ListItem>
        <FlatList
          data={data[1]}
          keyExtractor={(item, index) => index}
          listKey={(item, index) => index}
          renderItem={(item) => {
            return this._listItem(item.item)
          }}
        />
      </Card>
    )
  }

  render() {
    const incompleteVisitData = this.props.incompleteVisit;
    return (
      <Container>
        <Header 
          navigator={this.props.navigation}
          ref={(header) => { this.header = header; }}
          title = {this.props.userData.fullname}
        />
        <StatusBar backgroundColor = {CONFIG.theme_color}/>
        {(this.state.loading)? <Loading/> :
          <Content refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          } contentContainerStyle={this._appointmenStyle(incompleteVisitData)}>
          {(incompleteVisitData.length > 0)?
            <FlatList
              removeClippedSubviews={false}
              initialNumToRender={Object.keys(incompleteVisitData).length}
              data={incompleteVisitData}
              keyExtractor={(item, index) => item.visit}
              listKey={(item, index) => index}
              renderItem={(item) => {
               return this._renderIncompleteVisitList(item.item)
              }}/>
            :
            <Nodata message="No Incomplete visits."/> }
          </Content>}
      </Container>
    );
  }
}