import { Vec3 } from "horizon/core";
import { TextStyle, ViewStyle } from "horizon/ui"

export const spawnTag = 'rapidSpawn';

export enum MapTypes {
  TRAVEL,
  PLAYER
}

export type PlayerPinData = {
  name: string;
  position: Vec3
}

export const mapColors = {
  mainPanel: '#fcf9e1ff',
  travelMapWindow: '#5b9e8dff',
  playerMapWindow: '#9f5e25ff',
  pinPrimary: '#59279aff',
  pinSecondary: '#a79f4cff',
  utilityButtons: '#9e5b5bff',
}

export const pinLabelTextFormatting: TextStyle = {
  fontSize: 12,
  fontFamily: "Roboto-Mono",
  fontWeight: "bold",
  textAlign: "center",
  textAlignVertical: "center"
}