import { connect } from 'react-redux'
import {
	fetchIncompleteCareplan,
	submitIncompleteCareplan
} from './incompleteCareplanActions';

import IncompleteCareplanComponent from './incompleteCareplanComponent';

const mapStateToProps = (state, props) => ({
	location_permission: state.reducer.login.loginData.location_tracking_permission,
	userData: state.reducer.login.loginData,
	visit_data: props.navigation.state.params.visit_data

});

const mapDispatchToProps = {
	fetchIncompleteCareplan,
	submitIncompleteCareplan
};

const mergeProps = (stateProps, dispatchProps, ownProps) =>{
  return{
  	...ownProps.navigation.state.params,
		...stateProps,
		...dispatchProps
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(IncompleteCareplanComponent);
