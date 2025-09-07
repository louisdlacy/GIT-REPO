// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import {
  CodeBlockEvents,
  Color,
  Component,
  Entity,
  Player,
  PropTypes,
} from "horizon/core";
import { ConfirmationPanelResponse, ConfirmPanelRequest } from "UI_ConfirmationManager";
import { simpleButtonEvent } from "UI_SimpleButtonEvent";

/**
 * Confirmation manager example for custom messages and sphere color changes.
 * Shows how to send and handle multiple confirmation requests.
 * Attach to a trigger for default behavior
 */
class UI_ConfirmationManager_Ex extends Component<typeof UI_ConfirmationManager_Ex> {
  static propsDefinition = {
    customMessage: { type: PropTypes.String, default: "Custom confirm message" },
    // Sphere target to change color
    sphereTarget: { type: PropTypes.Entity },
  };

  //reference to the Confirmation Manager
  private confirmationManager!: Entity;

  //Simple UI Button variables
  private sphereIsRed: boolean = false;
  private sphereRedMsg: string = "Make the sphere red?";
  private sphereBlueMsg: string = "Make the sphere blue?";

  //region preStart()
  preStart() {
    //find the confirmation manager
    this.confirmationManager = this.world.getEntitiesWithTags(["UI_ConfirmManager"])[0];
    if (!this.confirmationManager) {
      console.error("UI_ConfirmManager not found");
    }

    this.connectNetworkEvent(this.entity, ConfirmationPanelResponse, (data) => {
      this.handleResponse(data);
    });

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      this.requestConfirmation(player, this.props.customMessage);
    });

    this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
      const player = data.player;

      if (this.sphereIsRed) {
        this.requestConfirmation(player, this.sphereBlueMsg);
      } else {
        this.requestConfirmation(player, this.sphereRedMsg);
      }
    });
  }

  
  start() {}
  
  //region showConfirmation()
  private requestConfirmation(player: Player, confirmationMessage: string) {
    if (this.confirmationManager) {
      this.sendNetworkEvent(this.confirmationManager, ConfirmPanelRequest, {
        requester: this.entity,
        player: player,
        confirmationMessage: confirmationMessage,
      });
    }
  }


  //region handleResponse()
  handleResponse(data: { player: Player; message: string; accepted: boolean }) {
    if (!this.props.sphereTarget && data.message != this.props.customMessage) {
      console.error("Sphere target is null");
      return;
    }

    // Handle the response based on the confirmation message
    switch (data.message) {
      case this.props.customMessage:
        console.log("Confirmation accepted");
        break;
      case this.sphereRedMsg:
        if (!data.accepted) return;
        console.log("Making sphere red ");
        //changing color works because the sphereTarget Tint Strength = 1 in property panel
        this.props.sphereTarget?.color.set(new Color(1, 0, 0));
        this.sphereIsRed = true;
        break;
      case this.sphereBlueMsg:
        if (!data.accepted) return;
        this.props.sphereTarget?.color.set(new Color(0, 0, 1));
        this.sphereIsRed = false;
        break;
    }
  }
}
Component.register(UI_ConfirmationManager_Ex);
