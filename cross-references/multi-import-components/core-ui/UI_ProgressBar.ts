// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import { CodeBlockEvents, NetworkEvent, Player, PropTypes, Vec3 } from "horizon/core";
import { Binding, Text, UIComponent, UINode, View } from "horizon/ui";
import { addAmountEvent, simpleButtonEvent } from "UI_SimpleButtonEvent";

class UI_ProgressBar extends UIComponent<typeof UI_ProgressBar> {
  protected panelHeight: number = 300;
  protected panelWidth: number = 500;

  static propsDefinition = {
    // toggles visibility
    enabled: { type: PropTypes.Boolean, default: true },
    // autoIncrease
    autoIncrease: { type: PropTypes.Boolean, default: true },
    fillColor: { type: PropTypes.Color},
    // background color of the progress bar
    barColor: { type: PropTypes.Color },
    // show text value
    showValue: { type: PropTypes.Boolean, default: true },
    // color of the text value
    valueColor: { type: PropTypes.Color},
    // screen offset of the progress bar (x and y are in percentage of screen, z is layer order)
    screenOffset: { type: PropTypes.Vec3, default: new Vec3(50, 90, 0) },
    // rotation of the progress bar
    rotation: { type: PropTypes.Number, default: 0 },
    // scale of the progress bar
    scale: { type: PropTypes.Number, default: 1.0 },
    lvlUpRecipient: { type: PropTypes.Entity },
  };

  bnd_progressBar = new Binding<string>("0%");
  bnd_progressValue = new Binding<string>("0%");

  // HUD item for the progress bar
  private hudItem(progressBar: Binding<string>, progressValue: Binding<string>) {
    return [
      View({
        children: [
          // this view represents the moving part of the progress bar
          View({
            style: {
              height: "100%",
              width: progressBar,
              backgroundColor: this.props.fillColor,
              // backgroundColor: "rgba(255, 204, 0, 1)",
              alignSelf: "flex-start",
            },
          }),
          // this view represents the text label showing the progress percentage
          Text({
            text: progressValue,
            style: {
              fontFamily: "Kallisto",
              fontSize: 24,
              textAlign: "center",
              // color: "rgb(193, 119, 0)",
              color: this.props.valueColor,
              position: "absolute",
              display: this.props.showValue ? "flex" : "none",
              transform: [{ rotate: `${360 - this.props.rotation}deg` }],
            },
          }),
        ],
        // this style represents the background of the progress bar
        style: {
          height: "100%",
          width: "100%",
          alignSelf: "flex-end",
          backgroundColor: this.props.barColor,
          // backgroundColor: "rgb(255, 255, 255)",
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          //masks the progress bar to fit within the container
          overflow: "hidden",
        },
      }),
    ];
  }

  //region initializeUI()
  initializeUI(): UINode {
    if (!this.props.enabled) this.entity.visible.set(false);

    return View({
      children: [
        View({
          // Here the HUD item is used to create the progress bar
          children: [...this.hudItem(this.bnd_progressBar, this.bnd_progressValue)],
          style: {
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          },
        }),
      ],
      // this determines where the progress bar is on screen
      style: {
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
        width: "50%",
        height: 50,
        layoutOrigin: [0.5, 0.5],
        left: `${this.props.screenOffset.x}%`,
        top: `${100 - this.props.screenOffset.y}%`,
        position: "absolute",
        transform: [{rotate: `${this.props.rotation}deg`},
          { scale: this.props.scale }
        ],
        //this makes it render above any UI with smaller zIndex
        zIndex: this.props.screenOffset.z,
      },
    });
  }

  //used to store all player's progress
  private playerProgressMap = new Map<Player, number>();
  //used to interrupt and cancel the interval loop
  private timeoutId: number | null = null;

  //regio preStart()
  preStart() {
    if (!this.props.enabled) return;

    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterWorld,
      (player: Player) => {
        this.playerProgressMap.set(player, 0);

        if (this.props.autoIncrease) {
          this.autoIncreaseProgress();
        }
      }
    );

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player: Player) => {
      this.playerProgressMap.delete(player);
    });

    this.connectNetworkEvent(this.entity, addAmountEvent, (data) => {
       // interrupts any active async.setTimeout
      if (this.timeoutId) {
        this.async.clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.setProgress(data.player, data.amount);
    });

    //optional UI Simple Button action
    this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
      console.log("Received simpleButtonEvent:", data);
      // interrupts any active async.setTimeout
      if (this.timeoutId) {
        this.async.clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      const increment = 1;
      this.setProgress(data.player, increment);
    });
  }

  //region autoIncrease()
  // a repeated function to increase progress
  autoIncreaseProgress() {
    this.playerProgressMap.forEach((progress, p) => {
      this.setProgress(p, 1);
    });
    this.timeoutId = this.async.setTimeout(() => this.autoIncreaseProgress(), 100);
  }

  //region setProgress()
  // sets progress for the player
  setProgress(player: Player, increment: number) {
    let progress = this.playerProgressMap.get(player) || 0;
    const newProgress = progress + increment;
    if (newProgress >= 100) {
      console.log("LEVEL UP!");
      if(this.props.lvlUpRecipient){
        this.sendNetworkEvent(this.props.lvlUpRecipient, addAmountEvent, {player: player, amount: 1});
      }
    }
    // if progress plus increment exceeds 100 then set to 0, otherwise add increment to progress
    const remainder = newProgress - 100;
    progress = newProgress >= 100 ? remainder : newProgress;

    // update the players progress in the store map
    this.playerProgressMap.set(player, progress);
    // bindings must use 'set' for UI to update properly
    // by adding [player] we ensure the UI updates for only the specific player
    this.bnd_progressBar.set(`${progress}%`, [player]);
    this.bnd_progressValue.set(`${progress}%`, [player]);
  }

  //region showUI()
  showUI(show: boolean) {
    this.entity.visible.set(show);
  }
}
UIComponent.register(UI_ProgressBar);

export function convertOffsetToScreenSpace(offset: Vec3): { x: string; y: string } {
  // Assuming offset.x and offset.y are in percentage (0-100)
  const x = `${offset.x}%`;
  const y = `${100 - offset.y}%`;
  return { x, y };
}
