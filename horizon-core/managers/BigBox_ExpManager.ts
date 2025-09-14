import { BigBox_ExpCurve } from 'BigBox_ExpCurve';
import { Component, NetworkEvent, Player } from 'horizon/core';
import { Bindable, Text, TextStyle, View } from 'horizon/ui';

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

export const EXP_PERSISTENT_VAR = 'playerData:exp';

export const BigBox_ExpEvents = {
  expAddToPlayer: new NetworkEvent<{ player: Player, exp: number }>('expAddToPlayer'),
  expUpdatedForPlayer: new NetworkEvent<{ player: Player, currentLevel: number, percentExpToNextLevel: number, gainedExp: number }>('expUpdatedForPlayer'),
  requestInitializeExpForPlayer: new NetworkEvent<{ player: Player }>('requestInitializeExpForPlayer'),
};

var localExpStorage = new Map<Player, number>();

export class BigBox_Exp_UI_Utils {
  // Create text with an outline - The nastiest h4XX0r the world has ever known
  static outlineText(text: Bindable<string>, outlineSize: number, textStyle: TextStyle) {
    return View({
      children: [
        Text({ text, style: { textShadowOffset: [-outlineSize, -outlineSize], ...textStyle } }),
        // Absolute position so this will stack directly over the main text object
        Text({ text, style: { textShadowOffset: [outlineSize, -outlineSize], position: "absolute", ...textStyle } }),
        Text({ text, style: { textShadowOffset: [-outlineSize, outlineSize], position: "absolute", ...textStyle } }),
        Text({ text, style: { textShadowOffset: [outlineSize, outlineSize], position: "absolute", ...textStyle } }),
      ],
      style: {
        flexDirection: "row",
        justifyContent: "center",
      },
    });
  }
}

export class BigBox_ExpManager extends Component<typeof BigBox_ExpManager> {
  static propsDefinition = {};

  // Singleton
  static instance: BigBox_ExpManager;

  preStart() {
    BigBox_ExpManager.instance = this;
  }

  start() {
    this.connectNetworkBroadcastEvent(BigBox_ExpEvents.expAddToPlayer, this.OnExpAddToPlayer.bind(this));

    this.connectNetworkBroadcastEvent(BigBox_ExpEvents.requestInitializeExpForPlayer, (data: { player: Player }) => {
      this.OnExpAddToPlayer({ player: data.player, exp: 0 });
    });
  }

  private OnExpAddToPlayer(data: { player: Player, exp: number }) {
    var prevExp = this.world.persistentStorage.getPlayerVariable(data.player, EXP_PERSISTENT_VAR);

    if (prevExp == 0 && localExpStorage.get(data.player) != 0) {
      console.log("no persistent storage - using local storage");
      prevExp = localExpStorage.get(data.player) ?? 0;
    }

    var newExp = prevExp + data.exp;
    this.world.persistentStorage.setPlayerVariable(data.player, EXP_PERSISTENT_VAR, newExp);
    localExpStorage.set(data.player, newExp);

    console.log("Player " + data.player.name.get() + " has " + newExp + " exp from " + prevExp + " exp");

    this.sendNetworkBroadcastEvent(BigBox_ExpEvents.expUpdatedForPlayer, { player: data.player, currentLevel: BigBox_ExpCurve.instance.ExpToCurrentLevel(newExp), percentExpToNextLevel: BigBox_ExpCurve.instance.ExpToPercentToNextLevel(newExp), gainedExp: data.exp });
  }

  public GetPlayerExp(player: Player): number {
    return this.world.persistentStorage.getPlayerVariable(player, EXP_PERSISTENT_VAR);
  }
}
Component.register(BigBox_ExpManager);
