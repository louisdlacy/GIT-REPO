"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigBox_ExpManager = exports.BigBox_Exp_UI_Utils = exports.BigBox_ExpEvents = exports.EXP_PERSISTENT_VAR = void 0;
const BigBox_ExpCurve_1 = require("BigBox_ExpCurve");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
/** README
 * Turn on horizon/ui API by going into the Scripts menu -> Settings (gear icon) -> API -> horizon/ui
 *
 * In order to get persistent storage, add "playerData" to Variable Group
 * and then add "exp" as a variable under it.
 *
 * Copy this line of code to your script to add exp to the player
 * (replace currentPlayer with the player that wants to gain exp and xpGained with the amount that the player should gain):
 * this.sendNetworkBroadcastEvent(ExpEvents.expAddToPlayer, { player: currentPlayer, exp: xpGained });
*/
exports.EXP_PERSISTENT_VAR = 'playerData:exp';
exports.BigBox_ExpEvents = {
    expAddToPlayer: new core_1.NetworkEvent('expAddToPlayer'),
    expUpdatedForPlayer: new core_1.NetworkEvent('expUpdatedForPlayer'),
    requestInitializeExpForPlayer: new core_1.NetworkEvent('requestInitializeExpForPlayer'),
};
var localExpStorage = new Map();
class BigBox_Exp_UI_Utils {
    // Create text with an outline - The nastiest h4XX0r the world has ever known
    static outlineText(text, outlineSize, textStyle) {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({ text, style: { textShadowOffset: [-outlineSize, -outlineSize], ...textStyle } }),
                // Absolute position so this will stack directly over the main text object
                (0, ui_1.Text)({ text, style: { textShadowOffset: [outlineSize, -outlineSize], position: "absolute", ...textStyle } }),
                (0, ui_1.Text)({ text, style: { textShadowOffset: [-outlineSize, outlineSize], position: "absolute", ...textStyle } }),
                (0, ui_1.Text)({ text, style: { textShadowOffset: [outlineSize, outlineSize], position: "absolute", ...textStyle } }),
            ],
            style: {
                flexDirection: "row",
                justifyContent: "center",
            },
        });
    }
}
exports.BigBox_Exp_UI_Utils = BigBox_Exp_UI_Utils;
class BigBox_ExpManager extends core_1.Component {
    preStart() {
        BigBox_ExpManager.instance = this;
    }
    start() {
        this.connectNetworkBroadcastEvent(exports.BigBox_ExpEvents.expAddToPlayer, this.OnExpAddToPlayer.bind(this));
        this.connectNetworkBroadcastEvent(exports.BigBox_ExpEvents.requestInitializeExpForPlayer, (data) => {
            this.OnExpAddToPlayer({ player: data.player, exp: 0 });
        });
    }
    OnExpAddToPlayer(data) {
        var prevExp = this.world.persistentStorage.getPlayerVariable(data.player, exports.EXP_PERSISTENT_VAR);
        if (prevExp == 0 && localExpStorage.get(data.player) != 0) {
            console.log("no persistent storage - using local storage");
            prevExp = localExpStorage.get(data.player) ?? 0;
        }
        var newExp = prevExp + data.exp;
        this.world.persistentStorage.setPlayerVariable(data.player, exports.EXP_PERSISTENT_VAR, newExp);
        localExpStorage.set(data.player, newExp);
        console.log("Player " + data.player.name.get() + " has " + newExp + " exp from " + prevExp + " exp");
        this.sendNetworkBroadcastEvent(exports.BigBox_ExpEvents.expUpdatedForPlayer, { player: data.player, currentLevel: BigBox_ExpCurve_1.BigBox_ExpCurve.instance.ExpToCurrentLevel(newExp), percentExpToNextLevel: BigBox_ExpCurve_1.BigBox_ExpCurve.instance.ExpToPercentToNextLevel(newExp), gainedExp: data.exp });
    }
    GetPlayerExp(player) {
        return this.world.persistentStorage.getPlayerVariable(player, exports.EXP_PERSISTENT_VAR);
    }
}
exports.BigBox_ExpManager = BigBox_ExpManager;
BigBox_ExpManager.propsDefinition = {};
core_1.Component.register(BigBox_ExpManager);
