import { IntroductionApi } from "../../api/introductionApi";
import Helper from '../../config/Helper.js';

export const FETCH_INTRODUCTION_SLIDES = 'FETCH_INTRODUCTION_SLIDES';
export const EMPTY_INTRODUCTION_SLIDES = 'EMPTY_INTRODUCTION_SLIDES';

export const fetchIntroductionSlides = () => {
  return (dispatch, getState) => {
    let header = Helper.prepareHeader(getState().reducer.login.loginData.token);
    return IntroductionApi.getIntroductionSlides({}, header).then(res => {
      console.log(res)
      if (res.data.status === true){
        dispatch(UpdateIntroductionSlides(res.data.data.walkthrough_array))
        return res.data
      }else{
        let d = [];
        dispatch(EmptyIntroductionSlides(d))
        return res.data
      }
    })
  }
}

export const UpdateIntroductionSlides = (data) => {
  return {
    type: FETCH_INTRODUCTION_SLIDES,
    data
  }
}
export const EmptyIntroductionSlides = (data) => {
  return {
    type: EMPTY_INTRODUCTION_SLIDES,
    data
  }
}