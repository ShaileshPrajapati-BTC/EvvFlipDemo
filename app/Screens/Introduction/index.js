import { connect } from 'react-redux'
import {fetchIntroductionSlides} from './introActions';

import IntroductionComponent from './introductionComponent';

const mapStateToProps = state => ({
	introductionSlides: state.reducer.introduction.introductionSlides
});

const mapDispatchToProps = {
	fetchIntroductionSlides
};

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionComponent);
