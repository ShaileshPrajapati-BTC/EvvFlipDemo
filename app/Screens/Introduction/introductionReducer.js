import * as introActions from './introActions';
import _ from 'lodash';

const initialState = {
  introductionSlides: []
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