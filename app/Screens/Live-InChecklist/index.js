import {connect} from 'react-redux'
import {
  fetchLiveInCareplan,
  submitLiveInCareplan
} from './liveInActions';

import LiveInComponent from './liveInComponent';

const mapStateToProps = (state, props) => ({
  location_permission: state.reducer.login.loginData.location_tracking_permission,
  userData: state.reducer.login.loginData,
  rssiValue: state.reducer.tracking.rssiValue,
  visit_data: props.navigation.state.params.visit_data

});

const mapDispatchToProps = {
  fetchLiveInCareplan,
  submitLiveInCareplan
};

export default connect(mapStateToProps, mapDispatchToProps)(LiveInComponent);
