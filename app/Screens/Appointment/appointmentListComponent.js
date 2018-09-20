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
  Card,
  Fab,
  Button
} from 'native-base';

import {
  FlatList,
  RefreshControl,
  Platform,
  Linking
} from 'react-native';       

import CONFIG from '../../config/config.js';
import LableColor from '../../config/lableColor.js';
import Nodata from '../../components/no_data.js';
import Loading from '../../components/Loading.js';
import Helper from '../../config/Helper.js';
import moment from 'moment-timezone';
import THEME from '../../config/theme';

export default class AppointmentList extends Component {

  constructor(props) {
    super(props);
    this.state ={
      loading: true,
      refreshing: false,
      active: false
    };
  }

  componentDidMount() {
    console.log("appoinments", this.props)
    this._getAppointmentList();
  }
  
  componentWillMount(){
  }

  _getAppointmentList = async () => {
    setTimeout(()=>{
      this.setState({loading: false});
    }, 1000)
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._getAppointmentList().then(() => {
      this.setState({refreshing: false});
    });
  }  

  _navigate(name, type) {
    this.props.navigator.push({
      name: name,
      passProps: {
        type: type
      }
    })
  }

  _appointmenStyle(){
    if (this.props.appointment.length> 0){
     return {}
    }else{
      return {flex: 1, justifyContent: 'center',alignItems: 'center'}
    }
  }

  _openMap = (lat, long) =>{
    if (Platform.OS === 'ios'){
      Linking.openURL("http://maps.apple.com/?q=Clientll="+lat+","+long)
    }else{
      Linking.openURL("geo:"+lat+","+long);
    }
  }
  _renderAppointmentList(data) {
    return (
      <Card style={{flexWrap: 'nowrap'}} >
        <List style={{flexWrap: 'nowrap'}} >
          <ListItem itemDivider style={{backgroundColor: '#E8EAF6'}}>
            <Text>{moment(data[0]).format("MM/DD/YYYY")}</Text>
          </ListItem>
          <FlatList
            data={data[1]}
            keyExtractor={(item, index) => item.id}
            listKey={(item, index) => index}
            renderItem={(item) => {
              return this._listItem(item.item)
            }}/>
        </List>
      </Card>
    )
  }

  _listItem(data){
    return(
      <ListItem key={data.id} avatar onPress={()=> this._openMap(data.latitude, data.longitude)}>
        <Left key={'left'+data.id}>
          <Thumbnail key={'thumb'+data.id} medium source={{uri: data.client_image}} />
        </Left>
        <Body key={'body'+data.id} style={{flex:2,paddingBottom: 22, borderBottomWidth: 0}}>
          <Text key={'client_name'+data.id} style={{fontSize: 14}}>{data.client_name}</Text>
          <Text key={'time'+data.id} note style={{fontSize: 12, color: '#b2b2b2'}}>
            <Icon name="md-time" style={{fontSize: 12, color: '#b2b2b2'}}/> 
              {Helper.timeZoneConvert(data.utc_start_time, data.utc_end_time)}
          </Text>
        </Body>
        <Right key={'right'+data.id} style={{borderBottomWidth: 0}}>
          <Badge key={'badge'+data.id} style={{ backgroundColor: LableColor[data.new_status], borderRadius:5 }}>
            <Text key={'right_text'+data.id} style={{fontSize: 13}}>{data.new_status}</Text>
          </Badge>
          {(data.extended_hours != '') ?
            <Text note style={{fontSize: 10, marginTop: 5, color: CONFIG.theme_color}}>{data.extended_hours}</Text> : null}
        </Right>
      </ListItem>
    )
  }

  render() {
    console.log(this.props,"dsssc")
    return (
      <Container>
        {(this.state.loading)? <Loading/> :
          <Content refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          } contentContainerStyle={this._appointmenStyle()}>
          {(this.props.appointment.length > 0)?
            <FlatList
              data={this.props.appointment}
              keyExtractor={(item, index) => item.id}
              renderItem={(item) => {
                return this._renderAppointmentList(item.item)
              }}/>
            :
            <Nodata message="No appointments scheduled."/> }
          </Content>}
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: THEME.themeColor }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="md-calendar" />
            <Button style={{ backgroundColor: '#34A34F' }}>
              <Icon name="logo-whatsapp" />
            </Button>
            <Button style={{ backgroundColor: '#3B5998' }}>
              <Icon name="logo-facebook" />
            </Button>
            <Button style={{ backgroundColor: '#DD5144' }}>
              <Icon name="mail" />
            </Button>
          </Fab>
      </Container>
    );
  }
}
