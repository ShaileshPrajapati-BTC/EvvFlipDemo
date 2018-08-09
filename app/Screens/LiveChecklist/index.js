import { connect } from 'react-redux'
import {
	fetchLiveCheckList,
} from './liveCheckListActions';

import LiveCheckListComponent from './liveCheckListComponent';

const mapStateToProps = state => ({
	location_permission: state.reducer.login.loginData.location_tracking_permission,
	userData: state.reducer.login.loginData,
	rssiValue: state.reducer.tracking.rssiValue
});

const mapDispatchToProps = {
	fetchLiveCheckList
};

export default connect(mapStateToProps, mapDispatchToProps)(LiveCheckListComponent);
