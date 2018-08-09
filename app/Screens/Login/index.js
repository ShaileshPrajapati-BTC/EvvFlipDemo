import {connect} from 'react-redux'
import {Login, MobileChange} from './loginActions';

import LoginComponent from './loginComponent';

const mapStateToProps = state => ({
	login: state.reducer.login
});

const mapDispatchToProps = {
  Login,
  MobileChange
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
