import {connect} from 'react-redux'
import {sendAlertToAgency, verifyCaregiverStatus} from './splashActions';
import {ClearData} from '../Login/loginActions';

import SplashComponent from './splashComponent';

const mapStateToProps = state => ({
	mobile: state.reducer.login.mobile,
	splash: state.reducer.splash,
	login: state.reducer.login
});

const mapDispatchToProps = {
	sendAlertToAgency,
	verifyCaregiverStatus,
	ClearData
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashComponent);
