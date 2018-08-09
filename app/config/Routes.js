import React,{Component} from 'react';

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
import ScanQrCode from '../Screens/BeaconSetup/scanQrCode.js';
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

exports.renderScene = function(route, navigator) {
  try{
    switch (route.name) {
      case 'Login':
        return (<Login navigator={navigator} {...route.passProps}  />);
      case 'Qrcode':
        return (<Qrcode navigator={navigator} {...route.passProps}  />);
      case 'Scan':
        return (<Scan navigator={navigator} {...route.passProps}  />);
      case 'Splash':
        return (<Splash navigator={navigator} {...route.passProps}  />);
      case 'Task':
        return (<Task navigator={navigator} {...route.passProps}  />);                
      case 'SignatureCapture':
        return (<SignatureCapture navigator={navigator} {...route.passProps}  />);
      case 'TabList':
        return (<TabList navigator={navigator} {...route.passProps}  />);
      case 'ResetPassword':
        return (<ResetPassword navigator={navigator} {...route.passProps}  />);
      case 'Settings':
        return (<Settings navigator={navigator} {...route.passProps}  />);
      case 'Intro':
        return (<Intro navigator={navigator} {...route.passProps}  />);
      case 'OtpDetect':
        return (<OtpDetect navigator={navigator} {...route.passProps}  />);
      case 'SetPassword':
        return (<SetPassword navigator={navigator} {...route.passProps}  />);   
      case 'ForgotPassword':
        return (<ForgotPassword navigator={navigator} {...route.passProps}  />);
      case 'InstallBeacon':
        return (<InstallBeacon navigator={navigator} {...route.passProps}  />);
      case 'ScanQrCode':
        return (<ScanQrCode navigator={navigator} {...route.passProps} />);
      case 'ShowMessage':
        return (<ShowMessage navigator={navigator} {...route.passProps} />);
      case 'Notification':
        return (<Notification navigator={navigator} {...route.passProps} />);
      case 'RemoteCheckoutList':
        return (<RemoteCheckoutList navigator={navigator} {...route.passProps} />);
      case 'IncompleteCarePlan':
        return (<IncompleteCarePlan navigator={navigator} {...route.passProps} />);
      case 'ApprovedHours':
        return (<ApprovedHours navigator={navigator} {...route.passProps} />);    
      case 'Blog':
        return (<Blog navigator={navigator} {...route.passProps} />);
      case 'PayrollHours':
        return (<PayrollHours navigator={navigator} {...route.passProps} />);
      case 'LiveInCarePlan':
        return (<LiveInCarePlan navigator={navigator} {...route.passProps} />); 
      case 'TermsAndCondition':
        return (<TermsAndCondition navigator={navigator} {...route.passProps} />);          
	  case 'Telephony':
        return (<Telephony navigator={navigator} {...route.passProps} />);        
      case 'RemoteCheckoutCheckList':
        return (<RemoteCheckoutCheckList navigator={navigator} {...route.passProps} />);
      default:
        return (<Splash navigator={navigator} {...route.passProps}/>);
    }
  }catch(error){
    console.log(error,"crash->>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  }
};