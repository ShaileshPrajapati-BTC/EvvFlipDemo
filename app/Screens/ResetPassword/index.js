import {connect} from 'react-redux';
import {ResetPassword} from './resetActions';

import ResetPasswordComponent from './resetPasswordComponent';

const mapStateToProps = (state, props) => ({
	userData: state.reducer.login.loginData,
  log_out: props.navigation.state.params.log_out
});

const mapDispatchToProps = {
	ResetPassword
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordComponent);
