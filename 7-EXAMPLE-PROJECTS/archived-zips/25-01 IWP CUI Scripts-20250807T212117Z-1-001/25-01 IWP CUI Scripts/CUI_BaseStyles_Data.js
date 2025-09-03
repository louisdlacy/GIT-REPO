"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuiBaseStyles = void 0;
const core_1 = require("horizon/core");
const shadowColor = 'rgba(0, 204, 255, 0.7)';
const gradientColorA = 'rgb(136, 36, 218)';
const gradientColorB = 'rgb(62, 3, 189)';
const baseTextStyle = {
    color: 'white',
    fontFamily: 'Anton',
    fontSize: 10,
    fontWeight: 'bold',
    textShadowColor: shadowColor,
    textShadowOffset: [0, 0],
    textShadowRadius: 5,
    textAlign: 'center',
};
const baseButtonStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 2,
    paddingTop: 6,
    paddingLeft: 15,
    margin: 3,
    shadowColor: 'rgba(20, 20, 20, 0.7)',
    shadowOffset: [0, 0],
    shadowRadius: 10,
    shadowOpacity: 0.5,
    gradientColorA: gradientColorA,
    gradientColorB: gradientColorB,
    gradientXa: 0,
    gradientYa: 0,
    gradientXb: 1,
    gradientYb: 1,
    gradientAngle: '45deg',
};
const baseContainerStyle = {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 0,
    paddingTop: 40,
    paddingBottom: 150,
};
const buttonText = { ...baseTextStyle, fontSize: 18 };
const buttonBackground = baseButtonStyle;
const buttonsStyle = {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: '2%',
};
const containerStyle = {
    ...baseContainerStyle,
    gradientColorA: gradientColorA,
    gradientColorB: gradientColorB,
    borderWidth: 5,
    borderRadius: 250,
    borderColor: core_1.Color.white,
};
const imageStyle = {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    position: 'absolute',
};
exports.cuiBaseStyles = {
    colors: {
        shadowColor,
        gradientColorA,
        gradientColorB,
    },
    buttonText,
    buttonBackground,
    buttonsStyle,
    containerStyle,
    imageStyle,
};
