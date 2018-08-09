import React,{Component} from 'react';
import {
  Content,
  Spinner,
  Text,
  Item,
  Input,
  Button
} from 'native-base';
import {
  Modal,
  View
} from 'react-native';
import CONFIG from '../config/config.js';
import CONSTANT from '../config/constants';

export default class CommentPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: props.comment || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("dsdsdsds-------------", nextProps)
    if(nextProps.answer === "yes"){
      this.setState({comment: ""});
    }else if(this.state.comment === "") {
      this.setState({comment: nextProps.comment});
    }
  }

  _saveAndClosePopup(){
    // return callback
    // this.props.onSave(this.state.comment);
    this.props.onSave(this.state.comment)
  }

  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.comment_popup}
        onRequestClose={() => {}}
        style = {{backgroundColor: 'transparent'}}
      >
        <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <View style={{
            justifyContent: 'center',
            backgroundColor: 'white',
            marginLeft: 10,
            marginRight: 10,
            padding: 10,
            borderRadius: 10,
            height: 200
          }}>
            <Item regular style={{backgroundColor: '#EEEEEE'}}>
              <Input
                maxLength={CONSTANT.inputLimit}
                multiline={true}
                placeholder='Explain'
                placeholderTextColor="#8A8A8A"
                autoFocus={true}
                style={{height: 100, textAlignVertical: 'top'}}
                allowFontScaling={false}
                value={this.state.comment}
                onChangeText={(text) => {
                  this.setState({comment: text})
                }}
              />
            </Item>
            <Text style={{
              fontSize: 12,
              top: 2,
              alignSelf: 'flex-end',
              color: "#8A8A8A"
            }}>{`${this.state.comment.length} / ${CONSTANT.inputLimit}`}</Text>
            <Button
              disabled={this.state.comment.length <= 0}
              style={{
                marginTop: 15,
                justifyContent: 'center',
                backgroundColor: (this.state.comment.length > 0) ? CONFIG.theme_color : CONFIG.disabled_color,
                alignSelf: 'center',
                borderRadius: 10,
                width: 120
              }}
              onPress={() => this._saveAndClosePopup()}>
              <Text>SAVE</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}