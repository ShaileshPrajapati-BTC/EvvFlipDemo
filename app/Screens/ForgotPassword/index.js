import {connect} from 'react-redux';
import {
  ForgotPassword
} from './forgotPasswordActions';

import ForgotPasswordComponent from './forgotPasswordComponent';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  ForgotPassword
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordComponent);
