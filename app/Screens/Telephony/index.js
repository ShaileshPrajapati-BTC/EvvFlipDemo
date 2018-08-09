import React, {Component} from 'react';
import {Body, Card, Container, Content, Icon, Left, List, ListItem, Right, Spinner, Text} from 'native-base';

import {Animated, Image, Linking, StatusBar, View} from 'react-native';

import CONFIG from '../../config/config.js';
import Header from '../../components/back_header.js';

const arr = []
for (let i = 0; i < 4; i++) {
  arr.push(i)
}
export default class Telephony extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[
        {call: true, bgcolor1:'#BBDEFB',textColor: '#1E88E5',title: 'Dial to Call',information: 'Call 844-302-3645.'},
        {call: false,bgcolor1:'#D7CCC9',textColor: '#795548',title: 'Log-in',information: 'When prompted, enter your mobile phone number to login to our system.'},
        {call: true,bgcolor1:'#C8E6C9',textColor: '#43A047',title: 'Log-out',information: 'At the end of your shift, please call 844-302-3645 and re-enter your mobile phone number.'},
        {call: false,bgcolor1:'#D1C4E9',textColor: '#512DA8',title: 'Submit Checklist',information: "Please follow the prompts to complete the required checklist. Don't forget to enter 1 to accept each question."}
      ]
    }
    this.animatedValue = []
    arr.forEach((value) => {
      this.animatedValue[value] = new Animated.Value(0)
    })
  }

  componentDidMount() {
    this.animate()
  }

  animate() {
    const animations = arr.map((item) => {
      return Animated.timing(
        this.animatedValue[item],
        {
          toValue: 1,
          duration: 1000
        }
      )
    })
    Animated.sequence(animations).start()
  }
  openDial(call){
    if(call === true){
      Linking.openURL('tel:844-302-3645');
    }
  }
  renderData(){
    return this.state.data.map((data,i) => {
      return(
        <Animated.View style={{opacity: this.animatedValue[i]}}>
          <Card style={{flex:0,flexWrap: 'nowrap', backgroundColor: data.bgcolor1, borderRadius: 10}} >
            <List>
              <ListItem
                avatar
                style={{backgroundColor: data.bgcolor1,marginRight: 10,borderWidth:0, borderColor:'transparent'}}
              >
                <Left
                  style={{height:40,width:40,justifyContent:'center',alignItems:'center',
                    backgroundColor:data.textColor,borderRadius:20}}>
                  <Text style={{marginLeft:0,color: 'white',textAlign:'center',fontWeight:'bold'}}>{i+1}</Text>
                </Left>
                <Body style={{borderBottomWidth: 0}}>
                <Text style={{fontSize:14,color: data.textColor,fontWeight: 'bold',fontFamily: 'OpenSans' }}>{data.title}</Text>
                <Text
                  note
                  style={{fontSize:12,color: data.textColor,fontWeight: 'bold',fontFamily: 'OpenSans'}}
                  onPress = {()=>this.openDial(data.call)}
                >
                  {data.information}
                </Text>
                </Body>
                <Right style={{marginRight: 10, borderBottomWidth: 0}}/>
              </ListItem>
            </List>
          </Card>
        </Animated.View>)
    })
  }
  render() {
    const animations = this.renderData();
    return (
      <Container>
        <Header
          navigator={this.props.navigation}
          ref={(header) => { this.header = header; }}
          title="Telephony"
        />
        <StatusBar backgroundColor={CONFIG.theme_color} />
        <Content>
          <View style={{justifyContent: 'flex-start', marginTop: 5 }}>
            <Image square style={{height:150, alignSelf: 'center' }} source={require('../../images/IVR.jpg')}  />
            <View style={{marginTop: 10, marginBottom: 10}}>
              <Text style={styles.boldTextStyle}>
                Telephony How-to
              </Text>
            </View>
          </View>
          <View style={{justifyContent: 'flex-end'}}>
            {animations}
          </View>
        </Content>
      </Container>
    );
  }
}

let styles = {
  contentStyle: {
    flex: 1 ,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  boldTextStyle: {
    marginBottom: 5,
    fontSize: 20,
    alignSelf: 'center',
    color: CONFIG.theme_color,
    fontWeight: 'bold',
    fontFamily: 'OpenSans'
  },
  grayTextStyle: {
    marginBottom: 5,
    fontSize: 13,
    color: '#a8a8a8',
    alignSelf: 'center'
  },
  smsIcon: {
    color: CONFIG.theme_color,
    alignSelf: 'center',
    fontSize: 100,
    marginBottom: 20
  }
};