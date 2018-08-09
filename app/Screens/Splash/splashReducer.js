import * as splashActions from './splashActions'
import _ from 'lodash';

const initialState = {
  message: ""
};

export function SplashReducer(state = initialState, action) {
  switch (action.type) {
    case splashActions.CHECK_UPDATE: {
      return state;
    }
    default:
      return state
  }
}