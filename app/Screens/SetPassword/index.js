import {connect} from 'react-redux';
import {SetPassword} from './setPasswordActions';

import SetPasswordComponent from './setPasswordComponent';

const mapStateToProps = (state, props) => ({
  mobile: props.navigation.state.params.otpData.mobile,
  otp: props.navigation.state.params.otpData.otp
});

const mapDispatchToProps = {
  SetPassword
};

export default connect(mapStateToProps, mapDispatchToProps)(SetPasswordComponent);