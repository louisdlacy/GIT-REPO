import { BigBox_Exp_UI_Utils, BigBox_ExpEvents } from 'BigBox_ExpManager';
import { Component, Player } from 'horizon/core';
import { AnimatedBinding, Animation, Binding, Easing, UIComponent, View, ViewStyle } from 'horizon/ui';

class BigBox_UI_ExpBarPersistent extends UIComponent<typeof BigBox_UI_ExpBarPersistent> {
  static propsDefinition = {};
  private progressBarPercent = new AnimatedBinding(0);
  private currentLevel = new Binding(1);

  private readonly defaultTextSize = 28;
  private readonly outlineSizeMult = 0.075; // How large the text outline should be as a fraction of the font size

  start() {
    this.entity.visible.set(true);

    this.connectNetworkBroadcastEvent(BigBox_ExpEvents.expUpdatedForPlayer, this.OnExpUpdatedForPlayer.bind(this));

    this.sendNetworkBroadcastEvent(BigBox_ExpEvents.requestInitializeExpForPlayer, { player: this.entity.owner.get() });
  }

  initializeUI() {
    const progressBarFullHeight = 16; // Height of the background bar
    const progressInnerBarPadding = 2;
    const progressBorderRadius = 5;

    const levelTextView = View({
      children: [
        BigBox_Exp_UI_Utils.outlineText(
          this.currentLevel.derive(x => "Level " + x.toString()), this.defaultTextSize * this.outlineSizeMult, {
          fontFamily: "Roboto",
          color: "white",
          fontWeight: "700",
          fontSize: this.defaultTextSize,
          alignItems: "center",
          textAlign: "center",
        })
      ]
    });

    const rootPanelStyle: ViewStyle = {
      width: "20%",
      height: "20%",
      position: "absolute",
      justifyContent: "flex-end", // Align vertical to the bottom
      alignContent: "center",
      alignSelf: "flex-start", // alight to left of screen
      alignItems: "flex-start", // Align horizontal to the middle
      marginLeft: "5%", // Add space on the left side
    };

    const progressionBarView = View({
      children: [
        // Top "fill" bar
        View({
          style: {
            height: progressBarFullHeight - progressInnerBarPadding * 2,
            width: this.progressBarPercent.interpolate([0, 1], ["0%", "100%"]),
            backgroundColor: "lawngreen", // Fill
            borderRadius: progressBorderRadius - progressInnerBarPadding, // Round the edges
          },
        }),
      ],
      style: {
        height: progressBarFullHeight,
        width: "80%",
        backgroundColor: "darkolivegreen", // Background
        borderRadius: progressBorderRadius, // Round the edges
        padding: progressInnerBarPadding, // Bring the edges in on all sides slightly
      },
    });

    return View({//Root Panel + Panel Background Image
      children: [
        levelTextView,
        progressionBarView
      ],
      style: rootPanelStyle,
    });
  }

  private OnExpUpdatedForPlayer(data: { player: Player, currentLevel: number, percentExpToNextLevel: number, gainedExp: number }) {
    if (data.player === this.entity.owner.get()) {
      this.progressBarPercent.set(x => {
        if (x > data.percentExpToNextLevel) {
          return 0;
        }
        else {
          return x;
        }
      });

      this.progressBarPercent.set(Animation.timing(data.percentExpToNextLevel, { duration: 100, easing: Easing.inOut(Easing.ease) }));
      this.currentLevel.set(data.currentLevel);
    }
  }
}
Component.register(BigBox_UI_ExpBarPersistent);
