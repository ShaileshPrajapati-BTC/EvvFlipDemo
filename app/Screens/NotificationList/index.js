import {connect} from 'react-redux'
import {
    extendAppointment,
    fetchNotificationList,
    submitDashboardCommentResponse,
    submitVisitStatusLocation
} from './notificationActions';

import {UpdateNotificationCount} from '../TabList/tabListActions';

import NotificationComponent from './notificationComponent';

const mapStateToProps = state => ({
	location_permission: state.reducer.login.loginData.location_tracking_permission,
	notificationList: state.reducer.notificationList.notification
});

const mapDispatchToProps = {
	fetchNotificationList,
	UpdateNotificationCount,
	submitVisitStatusLocation,
	submitDashboardCommentResponse,
	extendAppointment
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationComponent);
