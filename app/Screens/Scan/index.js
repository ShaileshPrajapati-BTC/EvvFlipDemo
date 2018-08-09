import { connect } from 'react-redux';

// import {
// 	StartBeacon,
// 	StopBeacon,
// 	TrackingDataChange,
// 	SendTrackingReport,
// 	StoreTrackData,
// 	EmptyTrackData,
// 	StartLocation,
// 	fetchLocation
// } from '../Tracking/trackingActions.js';

import {
  Logout
} from '../Login/loginActions';
import {
	getAppointmentStatus,
	getNextAppointmentStatus
} from '../Appointment/appointmentActions';

import ScanComponent from './scanComponent';

const mapStateToProps = state => ({
	in_out_status: state.reducer.login.loginData.in_out_status,
	deviceinfo: state.reducer.login.deviceinfo,
	userData: state.reducer.login.loginData,
	rssiValue: state.reducer.tracking.rssiValue,
	beaconColor: state.reducer.tracking.beaconColor,
	isTrackingStart: state.reducer.tracking.isTrackingStart,
	lastApiCallTime: state.reducer.tracking.lastApiCallTime,
	status : state.reducer.tracking.status,
	distance: state.reducer.tracking.distance,
	logoutLoader: state.reducer.login.logoutLoader
});

const mapDispatchToProps = {
	// StartBeacon,
	// StopBeacon,
	// TrackingDataChange,
	// SendTrackingReport,
	Logout,
	getAppointmentStatus,
	getNextAppointmentStatus,
	// StoreTrackData,
	// EmptyTrackData,
	// StartLocation,
	// fetchLocation
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanComponent);
