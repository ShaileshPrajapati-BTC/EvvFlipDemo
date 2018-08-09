import {connect} from 'react-redux'
import {
  beaconUpdate,
  beaconVerify
} from './showMessageActions';

import {
  updateSetupData,
  resetSetupData,
  BeaconSetupDataChange,
  fetchLocation
} from '../InstallBeacon/installBeaconActions';

import ShowMessageComponent from './showMessageComponent';

const mapStateToProps = state => ({
  location_permission: state.reducer.login.loginData.location_tracking_permission,
  client_id: state.reducer.unitSetup.client_id,
  button: state.reducer.unitSetup.button,
  client_name: state.reducer.unitSetup.client_name,
  uuid: state.reducer.unitSetup.uuid,
  installKey: state.reducer.unitSetup.installKey,
  longitude: state.reducer.unitSetup.longitude,
  latitude: state.reducer.unitSetup.latitude,
});
const mapDispatchToProps = {
  beaconUpdate,
  beaconVerify,
  updateSetupData,
  resetSetupData,
  BeaconSetupDataChange,
  fetchLocation
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowMessageComponent);
