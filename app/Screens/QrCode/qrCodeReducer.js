import * as qrCodeActions from './qrCodeActions'
import _ from 'lodash';

const initialState = {
  qrCodeData: {}
};

export function QrCodeReducer(state = initialState, action) {
  switch (action.type) {
    case qrCodeActions.UPDATE_QR_CODE_DATA: {
      return _.assign( {}, state, { qrCodeData: _.assign({}, state.qrCodeData, action.data) });
    }
    case qrCodeActions.SUBMIT_CAREPLAN_SUCCESS:{
      console.log(action)
      return state
    }
    default:
      return state
  }
}