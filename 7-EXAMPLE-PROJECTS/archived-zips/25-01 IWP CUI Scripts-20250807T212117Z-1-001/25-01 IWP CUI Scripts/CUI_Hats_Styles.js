"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuiHatsStyles = void 0;
const CUI_BaseStyles_Data_1 = require("CUI_BaseStyles_Data");
const core_1 = require("horizon/core");
const buttonText = {
    ...CUI_BaseStyles_Data_1.cuiBaseStyles.buttonText,
};
const buttonBackground = {
    ...CUI_BaseStyles_Data_1.cuiBaseStyles.buttonBackground,
    width: 45,
    height: 25,
};
const buttonsStyle = {
    ...CUI_BaseStyles_Data_1.cuiBaseStyles.buttonsStyle,
    flexDirection: 'row',
    position: 'absolute',
    top: 340,
};
const containerStyle = {
    ...CUI_BaseStyles_Data_1.cuiBaseStyles.containerStyle,
};
const imageStyle = {
    ...CUI_BaseStyles_Data_1.cuiBaseStyles.imageStyle,
    position: 'absolute',
    top: 110,
    width: 185,
    height: 185,
    resizeMode: 'stretch',
    borderColor: core_1.Color.white,
    borderWidth: 4,
    borderRadius: 200,
};
const imageTitleTextStyle = {
    position: 'absolute',
    top: 305,
};
const imageSubTitleTextStyle = {
    position: 'absolute',
    fontSize: 12,
    top: 325,
};
const iconImageStyle = {
    ...CUI_BaseStyles_Data_1.cuiBaseStyles.imageStyle,
    position: 'relative',
    width: 65,
    height: 65,
    resizeMode: 'stretch',
    borderColor: core_1.Color.white,
    borderWidth: 2,
    borderRadius: 50,
    margin: 4,
    tintOperation: 'multiply',
};
const arrowImageStyle = {
    width: 30,
    height: 20,
    position: 'absolute',
    top: 3,
};
const titleTextStyle = {
    fontWeight: 'bold',
    fontFamily: 'Anton',
    fontSize: 35,
    position: 'absolute',
    top: 50,
};
const tokenBalanceTextStyle = {
    fontSize: 24,
    fontFamily: 'Anton',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '2%',
    position: 'absolute',
    top: 400,
};
const rowImagesContainerStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '50%',
    justifyContent: 'space-around',
    paddingTop: '5%',
    paddingLeft: '10%',
    paddingRight: '10%',
};
exports.cuiHatsStyles = {
    buttonText,
    buttonBackground,
    buttonsStyle,
    containerStyle,
    imageStyle,
    imageTitleTextStyle,
    imageSubTitleTextStyle,
    arrowImageStyle,
    titleTextStyle,
    tokenBalanceTextStyle,
    iconImageStyle,
    rowImagesContainerStyle,
};
