import { Color, Component, IUI, Player, PopupOptions, PropTypes, Vec3 } from "horizon/core";


let component: Component | undefined = undefined;

const vrPopUpOptions: PopupOptions = {
  position: new Vec3(0, -0.3, 0),
  fontSize: 5,
  fontColor: Color.black,
  backgroundColor: Color.white,
  playSound: true,
  showTimer: false,
}

const xsPopUpOptions: PopupOptions = {
  position: new Vec3(-0.09, -0.3, 0),
  fontSize: 3,
  fontColor: Color.black,
  backgroundColor: Color.white,
  playSound: true,
  showTimer: false,
}


//Must attach to some entity, ideally an "empty" and there should be only one entity with this script attached
class Util_PopUp_Func_Entity extends Component<typeof Util_PopUp_Func_Entity> {
  static propsDefinition = {
    vrPosition: { type: PropTypes.Vec3, default: new Vec3(0, -0.3, 0) },
    vrFontSize: { type: PropTypes.Number, default: 5 },
    xsPosition: { type: PropTypes.Vec3, default: new Vec3(-0.09, -0.3, 0) },
    xsFontSize: { type: PropTypes.Number, default: 3 },
    fontColor: { type: PropTypes.Color, default: Color.black },
    backgroundColor: { type: PropTypes.Color, default: Color.white },
    playSound: { type: PropTypes.Boolean, default: true },
    showTimer: { type: PropTypes.Boolean, default: false },
  };

  start() {
    component = this;

    vrPopUpOptions.position = this.props.vrPosition;
    vrPopUpOptions.fontSize = this.props.vrFontSize;
    vrPopUpOptions.fontColor = this.props.fontColor;
    vrPopUpOptions.backgroundColor = this.props.backgroundColor;
    vrPopUpOptions.playSound = this.props.playSound;
    vrPopUpOptions.showTimer = this.props.showTimer;

    xsPopUpOptions.position = this.props.xsPosition;
    xsPopUpOptions.fontSize = this.props.xsFontSize;
    xsPopUpOptions.fontColor = this.props.fontColor;
    xsPopUpOptions.backgroundColor = this.props.backgroundColor;
    xsPopUpOptions.playSound = this.props.playSound;
    xsPopUpOptions.showTimer = this.props.showTimer;
  }
}
Component.register(Util_PopUp_Func_Entity);


export const popUp_Func = {
  popUp,
  playPopUpAfterDelay,
}


/**
 * Plays a popup.
 * @param players Can be a single player in square brackets, ie. `[player]`, or an array of players. If you pass in `undefined`, it plays the popup to all players.
 * @param message The message to be shown.
 * @param isXS Should be `true` if the player is not on VR.
 * @param lengthSeconds Time for the popup in seconds to be active.
 * @param font The desired font, or `undefined` if you want no font changes.
 * @param popUpOptions Options to customize a specific popup, ie. changing the font and background color : `{ fontColor: new Color.red, backgroundColor: Color.black }`.
 */
function popUp(players: Player[] | undefined, message: string, isXS: boolean, lengthSeconds: number, font: PopUpFonts | undefined = undefined, popUpOptions: Partial<PopupOptions>) {
  const fontFormatted = font ? '<font=' + font + '>' : '';

  const curPopUpOptions: PopupOptions = {
    ...(isXS ? xsPopUpOptions : vrPopUpOptions),
    ...popUpOptions,
  }

  if (players !== undefined) {
    players.forEach((player) => {
      component?.world.ui.showPopupForPlayer(player, fontFormatted + message, lengthSeconds, curPopUpOptions);
    });
  }
  else {
      component?.world.ui.showPopupForEveryone(fontFormatted + message, lengthSeconds, curPopUpOptions);
  }
}

/**
 * Plays a popup after a delay.
 * @param delayInMs The amount of time to wait before playing the popup in ms.
 * @param players Can be a single player in square brackets, ie. `[player]`, or an array of players. If you pass in `undefined`, it plays the popup to all players.
 * @param message The message to be shown.
 * @param isXS Should be `true` if the player is not on VR.
 * @param lengthSeconds Time for the popup in seconds to be active.
 * @param font The desired font, or `undefined` if you want no font changes.
 * @param popUpOptions Options to customize a specific popup, ie. changing the font and background color : `{ fontColor: new Color.red, backgroundColor: Color.black }`.
 */
function playPopUpAfterDelay(delayInMs: number, players: Player[], message: string, isXS: boolean, lengthSeconds: number, font: PopUpFonts | undefined = undefined, popUpOptions: Partial<PopupOptions>) {
  component?.async.setTimeout(() => {
    popUp(players, message, isXS, lengthSeconds, font, popUpOptions);
  }, delayInMs);
}



export type PopUpFonts = 'Bangers SDF' | 'Anton SDF' | 'Roboto-Bold SDF' | 'Oswald Bold SDF' | 'Electronic Highway Sign SDF';