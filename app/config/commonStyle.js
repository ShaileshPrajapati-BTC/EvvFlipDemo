import THEME from './theme.js';
import {Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');
const scanCardBorder = 10;

module.exports = {
    buttonStyle: {
        justifyContent: 'center',
        borderColor: THEME.buttonColor,
        backgroundColor: THEME.buttonColor,
        borderRadius: 5,
        marginTop: 25,
        marginBottom: 20,
        marginLeft: 15,
        width: 285,
        borderWidth: 1
    },
    buttonTextStyle: {alignSelf:'center', color: THEME.buttonTextColor},
    logoStyle: {
        alignSelf: 'center',
        width: 100,
        height: 100
    },
    boldTextStyle: {
        marginBottom: 5, 
        fontSize: 16, 
        alignSelf: 'center',
        color: THEME.textColor
    },
    grayTextStyle: {
        marginBottom: 5, 
        fontSize: 13, 
        color: THEME.textColor,
        alignSelf: 'center'
    },
    contentStyle: {
        flex: 1 ,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: THEME.themeColor
    },
    headerTitle: {
        color: 'white',
        fontSize: 16
    },
    header: { 
        backgroundColor: THEME.themeColor, 
        height: 64
    },
    otpInputStyle: {
        borderColor: THEME.inputIconColor,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 13,
        marginTop: 8,
        width: 195,
        alignSelf: 'center',
        height: 40,
    },
    otpSubmitButton: {
        marginBottom: 10,
        alignSelf: 'center',
        borderColor: THEME.buttonColor,
        backgroundColor: THEME.buttonColor,
        marginRight: 5,
        marginLeft: 5
    },
    otpBtnContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 5
    },
    dropDownAlert: { fontSize: 13, textAlign: 'left', color: THEME.textColor, backgroundColor: 'transparent' },
    setPasswordForm: {alignSelf: 'center', marginTop:15, marginRight: 15},
    setPassSubmitBtn: {
        justifyContent:'center',
        borderColor: THEME.buttonColor, 
        backgroundColor: THEME.buttonColor,
        borderRadius:10, 
        marginTop: 25, 
        marginBottom: 15, 
        marginLeft:15,
        width:285,
        borderWidth:1 
    },
    notificationIcon: {color: 'white', fontSize: 32},
    notificationBadge: {
        position: 'absolute',
        right: 5, top: 0, height: 22, width: 22, justifyContent: 'center', alignItems: 'center',
        backgroundColor: THEME.notificationBadge, borderRadius: 11
    },
    badgeText: {
        fontSize: 10,
        lineHeight: 10,
        color: THEME.textColor
    },
    tabHeading: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: THEME.themeColor
    },
    tabText: {marginBottom: 3, fontSize: 14,color: THEME.textColor},
    scanStatusBtn: {backgroundColor:'red', flex:1,borderRadius: 20, width:40, height:40,alignItems: 'center',justifyContent:'center'},
    scanIcon: {color: THEME.textColor,fontSize:25},
    scanCardBorder: 15,
    scanCardInfo: {alignSelf:'center', width: width-30, borderRadius: scanCardBorder},
    scanList: {borderTopEndRadius: scanCardBorder, borderTopRightRadius: scanCardBorder},
    scanListItem: {backgroundColor: THEME.scanInfoHeader, borderTopEndRadius: scanCardBorder, borderTopLeftRadius: scanCardBorder},
    scanInfoText: {fontSize: 15, fontWeight: "bold"},
    scanListItemBottom :{backgroundColor : THEME.scanInfoBody, borderBottomRightRadius:scanCardBorder},
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,255)',
        opacity: 0.7
    },
    checkListSubBtn: {justifyContent:'center', backgroundColor: THEME.themeColor, alignSelf: 'center', marginTop: 30, marginBottom: 20,width:150, borderRadius:10},
    singnatureView: { flex: 1, flexDirection: "row",justifyContent: 'center', marginTop: 7, marginBottom:10},
    singnatureResetBtnStyle: { justifyContent:'center', borderColor: THEME.themeColor, backgroundColor: THEME.themeColor,width:100, borderRadius:10 },
    singnatureSaveBtnStyle: {justifyContent:'center', borderColor: THEME.themeColor, backgroundColor: THEME.themeColor, width:100, borderRadius:10, marginLeft:20 },
    singnatureBtnTextStyle: {color: THEME.textColor},
}