import {connect} from 'react-redux'
import {UpdateNotificationCount} from './tabListActions';

import {StopBeacon,SendAppOpenTracking} from '../Tracking/trackingActions.js';

import {Logout} from '../Login/loginActions';

import TabListComponent from './tabListComponent';

const mapStateToProps = state => ({
	deviceinfo: state.reducer.login.deviceInfo,
	mobile: state.reducer.login.mobile,
	login: state.reducer.login,
	notification_count: state.reducer.notification_count,
	in_out_status: state.reducer.login.loginData.in_out_status,
	userData: state.reducer.login.loginData
});

const mapDispatchToProps = {
	UpdateNotificationCount,
	StopBeacon,
	Logout,
	SendAppOpenTracking
};

export default connect(mapStateToProps, mapDispatchToProps)(TabListComponent);
