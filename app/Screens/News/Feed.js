import React, {Component} from 'react';
import {Badge, Body, Button, Card, CardItem, Icon, Left, ListItem, Right, Text, Thumbnail} from 'native-base';

import {Image, Linking, TouchableWithoutFeedback} from 'react-native';
import moment from 'moment-timezone';

export default class Feed extends Component {
    constructor(props) {
      super(props);
      this.state ={
        default_img: ''
      }
   }
   checkImg(data){
    if(data["_embedded"]["wp:featuredmedia"] != undefined)
      return (data["_embedded"]["wp:featuredmedia"][0]["source_url"]+"?fit=232%2C300")
    else
      return (this.state.default)
   }
  render() {
    const data = this.props.feed_data;
    return (
      <TouchableWithoutFeedback onPress={ () => Linking.openURL(data["link"]) } key={data["id"]+'main'}>
        <Card key={this.props.key} >
          <CardItem style={{ width: "100%", flex: 0 }} cardBody key={data["id"]+'CardItem'}>
            <Image resizeMode = {'cover'} source={{uri: this.checkImg(data)}} style={{height: 200, width: null, flex: 1}}/>
          </CardItem>
          <CardItem 
            key={data["id"]+'title'}
            style={{paddingLeft: 0, paddingRight: 0, paddingTop:5}}
          > 
            <Left key={data["id"]+'main'}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                {data["title"]["rendered"]}
              </Text>
            </Left>
          </CardItem>
          <CardItem 
            key={data["id"]+'desc'} 
            style={{paddingLeft: 0, paddingRight: 5, paddingTop:0, paddingBottom: 5}}
          >
            <Left key={data["id"]+'main'}>
              <Text style={{fontSize: 12, fontFamily: 'OpenSans'}}>
                {data["excerpt"]["rendered"].replace(/(<([^>]+)>|&nbsp;|\[&hellip;\])/ig,"")}
              </Text>
            </Left>
          </CardItem>
          <CardItem cardBody
            style={{backgroundColor: '#F5F5F5', paddingLeft: 0, paddingRight: 5, height: 30}} key={data["id"]+'detail'}
          >
            <Left key={data["id"]+'name'}>
              <Text style={{fontSize: 10, color: '#a7a7a7'}}>
                <Icon name="ios-person" style={{fontSize: 10, color: '#a7a7a7'}}/>
                {" "+data["_embedded"]["author"][0]["name"]}
              </Text>
            </Left>
            <Body/>
            <Right key={data["id"]+'date'}>
              <Text style={{fontSize: 10, color: '#a7a7a7'}}>
                <Icon name="md-time" style={{fontSize: 10, color: '#a7a7a7'}}/>
                 {" "+moment(data["date"]).tz('America/New_York').format("MM-DD-YYYY")}
              </Text>
            </Right>
          </CardItem>

        </Card>
      </TouchableWithoutFeedback>
    );
  }
}