import {HttpClient} from './httpClient' 

const BASE_URL = HttpClient.base_url

const INTRODUCTION_SLIDE = `${BASE_URL}/walkthrough`;

const getIntroductionSlides = (params={}, config={}) => {
  return HttpClient.get(INTRODUCTION_SLIDE, params, config)
}

const IntroductionApi = {
  getIntroductionSlides,
}

export {IntroductionApi}