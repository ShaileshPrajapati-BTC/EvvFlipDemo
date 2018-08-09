import {connect} from 'react-redux'
import {
  fetchClientList,
  updateSetupData,
  resetSetupData,
  fetchLocation
} from './installBeaconActions';

import InstallBeaconComponent from './installBeaconComponent';

const mapStateToProps = state => ({
  userData: state.reducer.login.loginData,
  client_id: state.reducer.unitSetup.client_id,
  button: state.reducer.unitSetup.button,
  client_name: state.reducer.unitSetup.client_name
});

const mapDispatchToProps = {
  fetchClientList,
  updateSetupData,
  resetSetupData,
  fetchLocation
};

export default connect(mapStateToProps, mapDispatchToProps)(InstallBeaconComponent);
