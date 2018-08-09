import {connect} from 'react-redux';
import {GetTermsAndConditionUrl, UpdateTermsAndConditionUrl} from './termsAndConditionActions';

import TermsAndConditionComponent from './termsAndConditionComponent';

const mapStateToProps = (state,props) => ({
	msg: props.navigation.state.params.msg
});

const mapDispatchToProps = {
	GetTermsAndConditionUrl,
	UpdateTermsAndConditionUrl
};

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditionComponent);
