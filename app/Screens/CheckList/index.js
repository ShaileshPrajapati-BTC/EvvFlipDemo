import { connect } from 'react-redux'
import {
	fetchLiveCheckList
} from '../LiveChecklist/liveCheckListActions';

import {
	fetchLocation
} from '../Tracking/trackingActions.js';

import CheckListComponent from './checklistComponent';

const mapStateToProps = state => ({
	userData: state.reducer.login.loginData,
	latitude: state.reducer.tracking.latitude,
  longitude: state.reducer.tracking.longitude,
});

const mapDispatchToProps = {
	fetchLiveCheckList,
	fetchLocation
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckListComponent);
