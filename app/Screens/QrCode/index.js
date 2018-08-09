import {connect} from 'react-redux'
import {CheckIn, CheckOut, CheckStatusForCheckInCheckOut, SubmitCareplan,UpdateStatusData} from './qrCodeActions';

// import {StartBeacon, StopBeacon, StopLocation, fetchLocation} from '../Tracking/trackingActions.js';

import QrCodeComponent from './qrCodeComponent';

const mapStateToProps = (state, props) => ({
  location_permission: state.reducer.login.loginData.location_tracking_permission,
  userType: state.reducer.login.loginData.user_type,
  in_out_status: state.reducer.login.loginData.in_out_status,
  userData: state.reducer.login.loginData,
  qrCode: state.reducer.qrCode,
  rssiValue: state.reducer.tracking.rssiValue,
  status: state.reducer.tracking.status,
  appointment_data: state.reducer.appointment.appointment,
  picker_state: props.navigation.state.params.picker_state || null,
  extra_milage: props.navigation.state.params.extra_milage || null,
  injury_status: props.navigation.state.params.injury_status || null,
  signature: props.navigation.state.params.signature || null,
  call_to_duty_hours: props.navigation.state.params.call_to_duty_hours || null,
  live_in_questions: props.navigation.state.params.questions,
  latitude: state.reducer.tracking.latitude,
  longitude: state.reducer.tracking.longitude,
  mobileLocation: state.reducer.tracking.mobileLocation,
  mobileBattery: state.reducer.tracking.mobileBattery
});

const mapDispatchToProps = {
  CheckIn,
  CheckOut,
  CheckStatusForCheckInCheckOut,
  SubmitCareplan,
  UpdateStatusData
};

export default connect(mapStateToProps, mapDispatchToProps)(QrCodeComponent);
