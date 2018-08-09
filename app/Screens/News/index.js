import {connect} from 'react-redux'

import NewsComponent from './newsComponent';

const mapStateToProps = state => ({
	token: state.reducer.login.loginData.token
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NewsComponent);
