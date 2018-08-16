import React, { Component } from 'react';
import { 
  Container
} from 'native-base';
import AppIntro from '../../../lib/Appintro.js';
import CONFIG from '../../config/config.js';
import Helper from '../../config/Helper.js';
import Loading from '../../components/Loading.js';
import { NavigationActions } from "react-navigation";

export default class IntroductionComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state ={
      loading: true
    };
  }

  componentWillMount(){
    console.log(this.props,"introoooo")
    this._getWalkThrough();
  }

  componentDidMount() {}

  async _getWalkThrough(){
    setTimeout(()=>{
      this.setState({loading: false});
    }, 1000)
  }

  onSkipBtnHandle = (index) => {
    console.log(index);
    this._checkRoutes();
  }
  doneBtnHandle = () => {
    this._checkRoutes();
  }
  nextBtnHandle = (index) => {
    console.log(index);
  }
  onSlideChangeHandle = (index, total) => {
    console.log(index, total);
  }

  _checkRoutes(){
    // let params = this.props.navigation.state.params.msg;
    // if (this.props.navigation.state.params.log_out != null || this.state.fromTab === true){
    //   // this._back_press();
    //   this.props.navigation.goBack();
    // }else{
      
    // }
    this._navigate('TabList', {show_checklist: true});
  }

  _back_press(){
    const routes = this.props.navigator.getCurrentRoutes();
    const routeToGo = routes.find( route => route.name === 'TabList');
    this.props.navigator.popToRoute(routeToGo);
    //this._navigate('Scan',null);
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
  
  render() {
    if (this.state.loading){
      return (
        <Container> 
          <Loading/> 
        </Container>
      );
    }else
    return (
        <AppIntro
          onNextBtnClick={this.nextBtnHandle}
          onDoneBtnClick={this.doneBtnHandle}
          onSkipBtnClick={this.onSkipBtnHandle}
          onSlideChange={this.onSlideChangeHandle}
          pageArray={this.props.introductionSlides}
          showDots={true}
          customStyles={{btnContainer: {flex: 1}}}
        />
    );
  }
}
