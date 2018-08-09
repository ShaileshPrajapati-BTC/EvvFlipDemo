import {connect} from 'react-redux';
import {VerifyOtp} from './otpActions';

import {ForgotPassword} from '../ForgotPassword/forgotPasswordActions';

import OtpComponent from './otpComponent';

const mapStateToProps = (state, props) => ({
  mobile: props.navigation.state.params.mobile
});

const mapDispatchToProps = {
  VerifyOtp,
  ForgotPassword
};

export default connect(mapStateToProps, mapDispatchToProps)(OtpComponent);
