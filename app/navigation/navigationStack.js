import { StackNavigator } from "react-navigation";
import Login from '../Screens/Login/index.js';
import Qrcode from '../Screens/QrCode/index.js';
import Scan from '../Screens/Scan/index.js';
import Splash from '../Screens/Splash/index.js';
import Task from '../Screens/CheckList/index.js';
import SignatureCapture from '../Screens/Signature/index.js';
import TabList from '../Screens/TabList/index.js';
import ResetPassword from '../Screens/ResetPassword/index.js';
import Settings from '../Screens/Settings/index.js';
import Intro from '../Screens/Introduction/index.js';
import OtpDetect from '../Screens/OtpDetect/index.js';
import SetPassword from '../Screens/SetPassword/index.js';
import ForgotPassword from '../Screens/ForgotPassword/index.js';
import InstallBeacon from '../Screens/BeaconSetup/InstallBeacon/index.js';
import ScanQrCode from '../Screens/BeaconSetup/ScanQrCode/index.js';
import ShowMessage from '../Screens/BeaconSetup/ShowMessage/index.js';
import Notification from '../Screens/NotificationList/index.js';
import RemoteCheckoutList from '../Screens/IncompleteVisit/index.js';
import IncompleteCarePlan from '../Screens/IncompleteCareplan/index.js';
import ApprovedHours from '../hours_report/approved_hour.js';
import PayrollHours from '../hours_report/payroll_hour.js';
import Blog from '../Screens/News/index.js';
import LiveInCarePlan from '../Screens/Live-InChecklist/index.js';
import TermsAndCondition from '../Screens/TermsAndConditions/index.js'
import Telephony from'../Screens/Telephony/index.js';
import RemoteCheckoutCheckList from '../Screens/RemoteCheckoutCareplan/index.js';

const navigator = StackNavigator({
  Splash: {screen: Splash},
  Login: {screen: Login},
  Qrcode: {screen: Qrcode},
  Scan: {screen: Scan},
  Task: {screen: Task},
  SignatureCapture: {screen: SignatureCapture},
  TabList: {screen: TabList},
  ResetPassword: {screen: ResetPassword},
  Settings: {screen: Settings},
  Intro: {screen: Intro},
  OtpDetect: {screen: OtpDetect},
  SetPassword: {screen: SetPassword},
  ForgotPassword: {screen: ForgotPassword},
  InstallBeacon: {screen: InstallBeacon},
  ScanQrCode: {screen: ScanQrCode},
  ShowMessage: {screen: ShowMessage},
  Notification: {screen: Notification},
  RemoteCheckoutList: {screen: RemoteCheckoutList},
  IncompleteCarePlan: {screen: IncompleteCarePlan},
  ApprovedHours: {screen: ApprovedHours},
  PayrollHours: {screen: PayrollHours},
  Blog: {screen: Blog},
  LiveInCarePlan: {screen: LiveInCarePlan},
  TermsAndCondition: {screen: TermsAndCondition},
  Telephony: {screen: Telephony},
  RemoteCheckoutCheckList: {screen: RemoteCheckoutCheckList}
},
{
	initialRouteName: 'Splash',
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
    gesturesEnabled: false,
    headerLeft: null,
    gesturesDirection: 'inverted',
  },
  cardStyle: {
   	backgroundColor: "#ffffff"
  }
});

export default navigator;
