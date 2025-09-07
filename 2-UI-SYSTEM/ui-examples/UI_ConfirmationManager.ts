// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import { Entity, NetworkEvent, Player, PropTypes } from "horizon/core";
import { Binding, Pressable, Text, UIComponent, UINode, View } from "horizon/ui";

//region Events
export const ConfirmPanelRequest = new NetworkEvent<{
  requester: Entity;
  player: Player;
  confirmationMessage: string;
}>("ConfirmPanelRequest");
export const ConfirmationPanelResponse = new NetworkEvent<{ player: Player; message: string; accepted: boolean }>(
  "ConfirmationPanelResponse"
);

/**
 * A reusable confirmation dialog that lets any script ask
 * a specific player “Are you sure?” and receive a yes/no response — fully networked
 * and player-scoped.
 */
class UI_ConfirmationManager extends UIComponent<typeof UI_ConfirmationManager> {
  static propsDefinition = {
    hideOnStart: { type: PropTypes.Boolean, default: true },
  };

  //Stores player to message making multiplayer confirmations work per player
  private playerMessageMap: Map<Player, { entity: Entity; message: string }> = new Map();

  //region bindings
  private bndDisplay = new Binding<string>("flex");
  private bndHeaderText = new Binding<string>("Are you sure you want to proceed?");

  initializeUI(): UINode {
    const bndConfirm_Scale = new Binding<number>(1);
    const bndCancel_Scale = new Binding<number>(1);

    return View({
      children: [
        //region Header Text
        Text({
          text: this.bndHeaderText,
          style: {
            // backgroundColor: "rgba(0, 255, 115, 0.8)", // Semi-transparent background
            color: "rgba(255, 255, 255, 1)", // Text color
            fontSize: 35,
            textAlign: "center",
            textAlignVertical: "center",
            height: "100%",
            width: "100%",
            fontFamily: "Kallisto",
            padding: 20,
            lineHeight: 40, //how tall the line is
          },
        }),
        View({
          children: [
            //region Cancel Btn
            Pressable({
              children: [
                ...button(
                  new Binding<string>("Cancel"),
                  new Binding<number>(30),
                  bndCancel_Scale
                ),
              ],
              onPress: (player) => {
                bndCancel_Scale.set(0.9, [player]);
                this.async.setTimeout(() => {
                  bndCancel_Scale.set(1, [player]);
                }, 100);
                this.handleConfirmationResponse(false, player);
              },
              style: {
                width: "40%",
                height: "100%",
              },
            }),
            //region Confirm Btn
            Pressable({
              children: [
                ...button(
                  new Binding<string>("Confirm"),
                  new Binding<number>(30),
                  bndConfirm_Scale
                ),
              ],
              onPress: (player) => {
                bndConfirm_Scale.set(0.9, [player]);
                this.async.setTimeout(() => {
                  bndConfirm_Scale.set(1, [player]);
                  this.handleConfirmationResponse(true, player);
                }, 100);
              },
              onRelease: (player) => {},
              style: {
                width: "40%",
                height: "100%",
              },
            }),
          ],
          style: {
            // backgroundColor: "rgba(2, 221, 255, 0.8)", // Semi-transparent background
            width: "100%",
            height: 60,
            flexDirection: "row",
            justifyContent: "space-evenly",
            top: -20,
          },
        }),
      ],
      //region Panel Properties
      style: {
        width: 500,
        height: 150,
        layoutOrigin: [0.5, 0.5],
        left: "50%",
        top: "50%",
        backgroundColor: "rgba(0, 132, 255, 1)", // Panel background
        borderRadius: 20,
        borderColor: "rgba(255, 255, 255, 1)", // Panel border color
        borderWidth: 8,
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        display: this.bndDisplay,
        zIndex: 1000,
      },
    });
  }

  //region preStart()
  preStart(): void {
    this.connectNetworkEvent(this.entity, ConfirmPanelRequest, (data) => {
      this.handleConfirmationRequest(data.requester, data.player, data.confirmationMessage);
    });
  }

  //region start()
  start(): void {
    if (this.props.hideOnStart) {
      this.bndDisplay.set("none");
    }
  }

  //region Request()
  handleConfirmationRequest(
    requester: Entity,
    player: Player,
    confirmationMessage: string
  ): void {
    //set up confirmation message
    console.log(`Confirmation request received`);
    this.bndHeaderText.set(confirmationMessage);
    // Show the confirmation panel for specific player
    this.bndDisplay.set("flex", [player]);

    //store message and requester to player (multiplayer support)
    this.playerMessageMap.set(player, { entity: requester, message: confirmationMessage });
  }

  //region Response()
  handleConfirmationResponse(accepted: boolean, player: Player): void {
    // Get the message associated with the player from stored map
    const message = this.playerMessageMap.get(player)?.message ?? { message: "" };
    const requester = this.playerMessageMap.get(player)?.entity ?? null;
    if (requester) {
      this.sendNetworkEvent(requester, ConfirmationPanelResponse, {
        player: player,
        message: message,
        accepted,
      });
    }
    // Hide the confirmation panel for specific player after 100ms
    this.async.setTimeout(() => {
      this.bndDisplay.set("none", [player]);
    }, 100);
  }
}
UIComponent.register(UI_ConfirmationManager);

//region UI Button
export const button = (
  bndHeaderText: Binding<string>,
  bndFontSize: Binding<number>,
  bndBtnScale: Binding<number>
) => {
  return [
    Text({
      text: bndHeaderText,
      style: {
        fontFamily: "Kallisto",
        width: "100%",
        height: "100%",
        alignSelf: "center",
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: 20,
        color: "rgba(2, 2, 2, 1)",
        fontSize: bndFontSize,
        textAlign: "center",
        textAlignVertical: "center",
        transform: [{ scale: bndBtnScale }],
        // borderColor: "rgba(109, 109, 109, 1)",
        // borderWidth: 6,
      },
    }),
  ];
};
