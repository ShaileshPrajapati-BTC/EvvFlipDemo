import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import {fetchAppointmentList} from './appointmentActions';

import AppointmentListComponent from './appointmentListComponent';

const mapStateToProps = state => ({
	appointment: state.reducer.appointment.appointment
});

const mapDispatchToProps = {
	fetchAppointmentList
};

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentListComponent);
