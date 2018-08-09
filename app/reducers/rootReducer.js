import {combineReducers} from 'redux';
import {LoginReducer} from '../Screens/Login/loginReducer';
import {SplashReducer} from '../Screens/Splash/splashReducer';
import navigationReducer from '../navigation/navigationReducer';
import {TabListReducer} from '../Screens/TabList/tabListReducer';
import {AppointmentReducer} from '../Screens/Appointment/appointmentReducer';
import {NotificationReducer} from '../Screens/NotificationList/notificationReducer';
import {IncompleteVisitReducer} from '../Screens/IncompleteVisit/incompleteVisitReducer';
import {IntroductionReducer} from '../Screens/Introduction/introductionReducer';
import {QrCodeReducer} from '../Screens/QrCode/qrCodeReducer';
import {TrackingReducer} from '../Screens/Tracking/trackingReducer';
import {InstallBeaconReducer} from "../Screens/BeaconSetup/InstallBeacon/installBeaconReducer";

//One root reducer for the whole app. This is done so that the app will have one single reducer to manage lots of other resources.
// And also communication between the reducers will be easier to maintain.

const reducer = combineReducers({
  login: LoginReducer,
  splash: SplashReducer,
  notification_count: TabListReducer,
  appointment: AppointmentReducer,
  notificationList: NotificationReducer,
  incompleteVisit: IncompleteVisitReducer,
  introduction: IntroductionReducer,
  qrCode: QrCodeReducer,
  tracking: TrackingReducer,
  unitSetup: InstallBeaconReducer
})

/* export default rootReducer*/
export default {
  reducer
};