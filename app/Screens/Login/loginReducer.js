import * as loginActions from './loginActions'
import _ from 'lodash';

const initialState = {
  mobile: '',
  password: '',
  login: true,
  disabled: false,
  deviceInfo : {},
  showPassword: false,
  loginData:{
    in_out_status: 'In',
    clock_status: 'Check in',
    client_name: 'John Doe',
    scan_status: 'N/A',
    user_type: true,
    fullname: "Demo",
    avatar: "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_960_720.png",
    token: "2fhsafhknslm",
    unit_setup_accesible: true
  },
  logoutLoader: false
};

export function LoginReducer(state = initialState, action) {
  switch (action.type) {
    case loginActions.LOGIN_SUCCESS: {
      return _.assign( {}, state, { loginData: _.assign({}, state.loginData, action.data) });
    }
    case loginActions.LOGIN_DATA_CHANGE:{
      console.log(action)
      return _.assign({}, state, {[action.key]: action.data})
    }
    case loginActions.LOGOUT_SUCCESS:{
      return _.assign({}, state, initialState)
    }
    case loginActions.LOGIN_ERROR:{
      return state;
    }
    default:
      return state
  }
}