import React, {Component} from 'react';
import {Container, Content, Spinner} from 'native-base';
import {StatusBar, View} from 'react-native';
import CONFIG from '../../config/config.js';
import NoBlog from './no_blog.js';
import Loading from '../../components/Loading.js';
import Helper from '../../config/Helper.js';
import Header from '../../components/back_header.js';
import Feed from './Feed.js';
import _ from 'lodash';

export default class NewsComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state ={
      loading: true,
      refreshing: false,
      data: [],
      url: 'http://www.at-homequalitycare.com/',
      page_no: 1,
      pagination: true
    };
  }
  
  componentDidMount() {
  }
  
  componentWillMount(){
    // this._getBlogFeedUrl(this.props.token)
    this._getBlogFeed("http://www.at-homequalitycare.com/", false);
  }

  isCloseToBottom({layoutMeasurement, contentOffset, contentSize}){
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  setPagination(){
    var p = this.state.page_no+1;
    if (this.state.pagination){
      this.setState({page_no: p, pagination: false});
      setTimeout(() => {
        this._getBlogFeed(this.state.url,true);
      }, 200);
    }
  }

  async _getBlogFeedUrl(token){
 
  }
  
  async _getBlogFeed(url, scroll_page = false){
    let self = this;
    try{
      fetch(url+"/wp-json/wp/v2/posts?page="+this.state.page_no+"&per_page=10&_embed").then((response) => response.json())
        .then((responseData) =>
        {
          console.log("----------------------->")
          console.log(responseData);
          if(responseData.status === 404){
            Helper._alertPopup('', CONFIG.get_blog);
          }
          else if (responseData.length > 0){
            if(scroll_page === true){
              let data = _.concat(this.state.data, responseData);
              this.setState({loading: false, data: data, pagination: true})
            }else{
              this.setState({loading: false, data: responseData, pagination: true});
            }
          }else{
            this.setState({loading: false, pagination: true});
          }
        })
        .catch(function(error) {
          Helper._alertPopup('', CONFIG.no_blog);
          console.log(error)
          self.setState({loading: false, pagination: true});
        });
    }catch(error){
      this.setState({loading: false, pagination: true});
    }
  }

  _renderBlogFeeds(){
    return this.state.data.map((feed_data, index) => {
      return(
        <Feed key={index} feed_data={feed_data}/>
      )
    })
  }
  render() {
    return (
      <Container>
        <Header
          navigator={this.props.navigation}
          ref={(header) => { this.header = header; }}
          title= "News"
        />
        <StatusBar backgroundColor={CONFIG.theme_color} />
        {(this.state.loading)? <Loading/> :
          <Content
            contentContainerStyle = {Helper._containerStyle(this.state.data)}
            onScroll={({nativeEvent}) => {
              if (this.isCloseToBottom(nativeEvent) && this.state.data.length > 0) {
                this.setPagination()
              }
            }}
          >
          {(this.state.data.length > 0)? <View style={{backgroundColor: '#E8EAF6'}}>{this._renderBlogFeeds()}</View> : <NoBlog message="No Blog's available."/> } 
          {(!this.state.pagination && this.state.data.length > 0) ? <Spinner color= {CONFIG.theme_color}/> : null}
          </Content>}
      </Container>
    );
  }
}