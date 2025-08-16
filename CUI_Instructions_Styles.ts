import { ImageStyle, TextStyle, ViewStyle } from "horizon/ui"


const baseTextStyle: TextStyle = {
  color: 'white',
  fontFamily: 'Anton',
  fontSize: 10,
  fontWeight: 'bold',
  textShadowColor: 'rgba(0, 204, 255, 0.7)',
  textShadowOffset: [0, 0],
  textShadowRadius: 5,
}

const baseButtonStyle: ViewStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  borderRadius: 10,
  padding: 10,
  margin: 5,
  shadowColor: 'rgba(20, 20, 20, 0.7)',
  shadowOffset: [0, 0],
  shadowRadius: 10,
  shadowOpacity: 0.5,
  gradientColorA: 'rgba(250, 14, 5, 1)',
  gradientColorB: 'rgba(250, 84, 5, 1)',
  gradientXa: 0,
  gradientYa: 0,
  gradientXb: 1,
  gradientYb: 1,
  gradientAngle: '45deg',
}

const baseContainerStyle: ViewStyle = {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 0,
}


const instructionBoardButtonText: TextStyle = { ...baseTextStyle, fontSize: 18 };

const instructionBoardButtonBackground: ViewStyle = baseButtonStyle;

const instructionBoardButtonsStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: 10,
  paddingTop: '80%',
}

const instructionBoardContainerStyle: ViewStyle = baseContainerStyle;

const instructionBoardImageStyle: ImageStyle = {
  height: '100%',
  width: '100%',
  resizeMode: 'cover',
  position: 'absolute',
}


export const cuiInstructionStyles = {
  buttonText: instructionBoardButtonText,
  buttonBackground: instructionBoardButtonBackground,
  buttonsStyle: instructionBoardButtonsStyle,
  containerStyle: instructionBoardContainerStyle,
  imageStyle: instructionBoardImageStyle,
}