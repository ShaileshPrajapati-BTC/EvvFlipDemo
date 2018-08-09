import * as incompleteVisitActions from './incompleteVisitActions';
import _ from 'lodash';

const initialState = {
  incompleteVisitList: []
};

export function IncompleteVisitReducer(state = initialState, action) {
  switch (action.type) {
    case incompleteVisitActions.FETCH_INCOMPLETE_APPOITMENT_LIST: {
      return _.assign( {}, state, { incompleteVisitList: action.data });
    }
    case incompleteVisitActions.EMPTY_INCOMPLETE_APPOITMENT_LIST: {
      return _.assign( {}, state, { incompleteVisitList: [] });
    }
    default:
      return state
  }
}