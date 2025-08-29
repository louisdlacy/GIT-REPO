import { BigBox_Exp_UI_Utils, BigBox_ExpEvents } from 'BigBox_ExpManager';
import { Component, Player } from 'horizon/core';
import { AnimatedBinding, Animation, Binding, Easing, UIComponent, View, ViewStyle } from 'horizon/ui';

class BigBox_UI_ExpBarPopup extends UIComponent<typeof BigBox_UI_ExpBarPopup> {
  static propsDefinition = {};
  private progressBarPercent = new AnimatedBinding(0.8);
  private currentLevel = new Binding(0);
  private expGained = new Binding(0);
  private verticalPosition = new AnimatedBinding(0);

  private readonly defaultTextSize = 28;
  private readonly defaultLevelTextSize = 50;
  private readonly outlineSizeMult = 0.075; // How large the text outline should be as a fraction of the font size

  start() {
    this.entity.visible.set(false);
    this.connectNetworkBroadcastEvent(BigBox_ExpEvents.expUpdatedForPlayer, this.OnExpUpdatedForPlayer.bind(this));

    this.sendNetworkBroadcastEvent(BigBox_ExpEvents.requestInitializeExpForPlayer, { player: this.entity.owner.get() });
  }

  initializeUI() {
    const progressBarFullHeight = 16; // Height of the background bar
    const progressInnerBarPadding = 2;
    const progressBorderRadius = 5;

    const levelTextView = View({
      children: [
        BigBox_Exp_UI_Utils.outlineText(this.currentLevel.derive(x => "Level " + x.toString()), this.defaultLevelTextSize * this.outlineSizeMult, {
          fontFamily: "Roboto",
          color: "white",
          fontWeight: "700",
          fontSize: this.defaultLevelTextSize,
          alignItems: "center",
          textAlign: "center",
        }),
        View({
          style: {
            width: "100%",
            flexDirection: "row",
            height: 5,
          }
        }),
      ]
    });

    const rootPanelStyle: ViewStyle = {
      width: "30%",
      height: "20%",
      position: "absolute",
      top: this.verticalPosition.interpolate([0, 1], ["-20px", "0px"]),
      justifyContent: "flex-end", // Align vertical to the bottom
      alignContent: "center",
      alignSelf: "center",
      alignItems: "center", // Align horizontal to the middle
    };

    const progressionBarView = View({
      children: [
        // Container for the progress bar
        View({
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
            width: "100%", // Full width for the background bar
            backgroundColor: "grey",
            borderRadius: progressBorderRadius, // Round the edges
            padding: progressInnerBarPadding, // Bring the edges in on all sides slightly
            flexDirection: "row",
          },
        }),
        // Text next to the entire progress bar
        BigBox_Exp_UI_Utils.outlineText(this.expGained.derive(x => "+" + x.toString() + " xp"), this.defaultTextSize * this.outlineSizeMult, {
          fontFamily: "Roboto",
          color: "lawngreen",
          fontWeight: "700",
          fontSize: this.defaultTextSize,
          alignItems: "center",
          textAlign: "center",
          marginLeft: 10, // Add some space between the bar and the text
        }),
      ],
      style: {
        flexDirection: "row", // Ensure children are laid out in a row
        alignItems: "center", // Center align vertically
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
    if (data.player === this.entity.owner.get() && data.gainedExp > 0) {

      this.entity.visible.set(true);
      this.expGained.set(data.gainedExp);
      this.progressBarPercent.set(x => {
        if (x > data.percentExpToNextLevel) {
          return 0;
        }
        else {
          return x;
        }
      });
      //this.progressBarPercent.set(data.percentExpToNextLevel);
      this.currentLevel.set(data.currentLevel);

      // Animate the view down
      this.verticalPosition.set((Animation.timing(1, { duration: 500, easing: Easing.inOut(Easing.ease) })));

      this.async.setTimeout(() => {
        this.progressBarPercent.set(Animation.timing(data.percentExpToNextLevel, { duration: 100, easing: Easing.inOut(Easing.ease) }));
      }, 600);

      this.async.setTimeout(() => {
        // Animate the view up
        this.verticalPosition.set((Animation.timing(0, { duration: 500, easing: Easing.inOut(Easing.ease) })));
        this.async.setTimeout(() => {
          this.entity.visible.set(false);
        }, 500);
      }, 3000);
    }
  }
}
Component.register(BigBox_UI_ExpBarPopup);
