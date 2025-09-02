// Copyright (c) Dave Mills (RocketTrouble). Released under the MIT License.

import { Asset, CodeBlockEvents, Component, Entity, Player, PropTypes } from "horizon/core";
import { NotificationEvent } from "UI_NotificationManager";
import { simpleButtonEvent } from "UI_SimpleButtonEvent";

class UI_NotificationManager_Ex1 extends Component<typeof UI_NotificationManager_Ex1> {
  static propsDefinition = {
    enabled: { type: PropTypes.Boolean, default: true },
    customMessage: { type: PropTypes.String, default: "Default notification message" },
    customImg: { type: PropTypes.Asset, default: null },
  };

  private notificationManager!: Entity;

  //region preStart()
  preStart() {
    this.notificationManager = this.world.getEntitiesWithTags(["UI_NotifyManager"])[0];
    if (!this.notificationManager) {
      console.error("UI_NotifyManager not found");
    }

    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterTrigger,
      (player) => {
        //first empty array will show Notification to everyone, eventually
        this.showNotification(this.props.customMessage, [], this.props.customImg ?? null);
      }
    );
    
    this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
      const player = data.player;
      const message = `${player.name.get()} pressed Simple Button!`;

      this.showNotification(message, [player], this.props.customImg ?? null);
    });
  }

  start() {}

  //region showNotification()
  private showNotification(
    message: string,
    players: Player[],
    imgAsset: Asset | null = null
  ) {
    const imgTextureID = imgAsset ? imgAsset.id.toString() : null;
    console.log(`imgTextureID is null: ${imgTextureID === null}`);
    if (this.notificationManager) {
      this.sendNetworkEvent(this.notificationManager, NotificationEvent, {
        message: message,
        players: players,
        imageAssetId: imgTextureID,
      });
    }
   
  }
}
Component.register(UI_NotificationManager_Ex1);

