import { connect } from 'react-redux'
import {
	fetchRemoteChcekoutCareplan,
	submitRemoteCheckoutCareplan
} from './remoteActions';

import RemoteCheckoutCareplanComponent from './remoteComponent';

const mapStateToProps = state => ({
	location_permission: state.reducer.login.loginData.location_tracking_permission,
	userData: state.reducer.login.loginData
});

const mapDispatchToProps = {
	fetchRemoteChcekoutCareplan,
	submitRemoteCheckoutCareplan
};

export default connect(mapStateToProps, mapDispatchToProps)(RemoteCheckoutCareplanComponent);
