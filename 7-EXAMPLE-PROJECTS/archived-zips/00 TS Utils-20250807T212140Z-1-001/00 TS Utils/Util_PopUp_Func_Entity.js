"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.popUp_Func = void 0;
const core_1 = require("horizon/core");
let component = undefined;
const vrPopUpOptions = {
    position: new core_1.Vec3(0, -0.3, 0),
    fontSize: 5,
    fontColor: core_1.Color.black,
    backgroundColor: core_1.Color.white,
    playSound: true,
    showTimer: false,
};
const xsPopUpOptions = {
    position: new core_1.Vec3(-0.09, -0.3, 0),
    fontSize: 3,
    fontColor: core_1.Color.black,
    backgroundColor: core_1.Color.white,
    playSound: true,
    showTimer: false,
};
//Must attach to some entity, ideally an "empty" and there should be only one entity with this script attached
class Util_PopUp_Func_Entity extends core_1.Component {
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
Util_PopUp_Func_Entity.propsDefinition = {
    vrPosition: { type: core_1.PropTypes.Vec3, default: new core_1.Vec3(0, -0.3, 0) },
    vrFontSize: { type: core_1.PropTypes.Number, default: 5 },
    xsPosition: { type: core_1.PropTypes.Vec3, default: new core_1.Vec3(-0.09, -0.3, 0) },
    xsFontSize: { type: core_1.PropTypes.Number, default: 3 },
    fontColor: { type: core_1.PropTypes.Color, default: core_1.Color.black },
    backgroundColor: { type: core_1.PropTypes.Color, default: core_1.Color.white },
    playSound: { type: core_1.PropTypes.Boolean, default: true },
    showTimer: { type: core_1.PropTypes.Boolean, default: false },
};
core_1.Component.register(Util_PopUp_Func_Entity);
exports.popUp_Func = {
    popUp,
    playPopUpAfterDelay,
};
/**
 * Plays a popup.
 * @param players Can be a single player in square brackets, ie. `[player]`, or an array of players. If you pass in `undefined`, it plays the popup to all players.
 * @param message The message to be shown.
 * @param isXS Should be `true` if the player is not on VR.
 * @param lengthSeconds Time for the popup in seconds to be active.
 * @param font The desired font, or `undefined` if you want no font changes.
 * @param popUpOptions Options to customize a specific popup, ie. changing the font and background color : `{ fontColor: new Color.red, backgroundColor: Color.black }`.
 */
function popUp(players, message, isXS, lengthSeconds, font = undefined, popUpOptions) {
    const fontFormatted = font ? '<font=' + font + '>' : '';
    const curPopUpOptions = {
        ...(isXS ? xsPopUpOptions : vrPopUpOptions),
        ...popUpOptions,
    };
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
function playPopUpAfterDelay(delayInMs, players, message, isXS, lengthSeconds, font = undefined, popUpOptions) {
    component?.async.setTimeout(() => {
        popUp(players, message, isXS, lengthSeconds, font, popUpOptions);
    }, delayInMs);
}
