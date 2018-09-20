import * as introActions from './introActions';
import _ from 'lodash';

const initialState = {
  introductionSlides: [
                        {
                          backgroundColor:"#4f8c33",
                          description:"Scan QR Code to Check-in",
                          fontColor:"#fff",
                          img:"http://174.138.60.52//assets/walkthrough/check_in-56cd1a01cdfc4585fccc68cbfcb76bc9c944ffa0a2671fb181143049e63d7937.png",
                          imgStyle:{height: 200, width: 225, resizeMode: "contain"},
                          level:10,
                          title:"Check-In"},
                          {
                          backgroundColor:"#4f8c33",
                          description:"Check Yes↵Check No↵Check Refused",
                          fontColor:"#fff",
                          img:"http://174.138.60.52//assets/walkthrough/careplan-447addc227e7e5a3f2ff0c142aa2442590555dc693497e1b0c7b7ed01d1f8d19.png",
                          imgStyle:{height: 200, width: 225, resizeMode: "contain"},
                          level:10,
                          title:"Careplan"},
                          {
                          backgroundColor:"#4f8c33",
                          description:"Scan QR Code to Check-Out",
                          fontColor:"#fff",
                          img:"http://174.138.60.52//assets/walkthrough/check_out-06f85eabff7fbd4b3ef2336378871b97564b1340d9d43e8666869f2c099fcd2c.png",
                          imgStyle:{height: 200, width: 225, resizeMode: "contain"},
                          level:10,
                          title:"Check-Out"
                        }
                      ]
};

export function IntroductionReducer(state = initialState, action) {
  switch (action.type) {
    case introActions.FETCH_INTRODUCTION_SLIDES: {
      return _.assign( {}, state, { introductionSlides: action.data });
    }
    case introActions.EMPTY_INTRODUCTION_SLIDES: {
      return _.assign( {}, state, { introductionSlides: [] });
    }
    default:
      return state
  }
}