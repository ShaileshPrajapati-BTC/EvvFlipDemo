import {connect} from 'react-redux'
import {
  BeaconSetupDataChange
} from '../InstallBeacon/installBeaconActions';

import ScanQrCode from './scanQrCode';

const mapStateToProps = state => ({
  userData: state.reducer.login.loginData,
  button: state.reducer.unitSetup.button,
});

const mapDispatchToProps = {
  BeaconSetupDataChange
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanQrCode);