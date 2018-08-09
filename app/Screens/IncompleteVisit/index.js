import { connect } from 'react-redux'
import {fetchIncompleteAppointmentList} from './incompleteVisitActions';

import incompleteVisitComponent from './incompleteVisitComponent';

const mapStateToProps = state => ({
	incompleteVisit: state.reducer.incompleteVisit.incompleteVisitList,
	userData: state.reducer.login.loginData
});

const mapDispatchToProps = {
	fetchIncompleteAppointmentList
};

export default connect(mapStateToProps, mapDispatchToProps)(incompleteVisitComponent);
