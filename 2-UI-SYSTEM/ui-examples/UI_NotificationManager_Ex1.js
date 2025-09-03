"use strict";
// Copyright (c) Dave Mills (RocketTrouble). Released under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const UI_NotificationManager_1 = require("UI_NotificationManager");
const UI_SimpleButtonEvent_1 = require("UI_SimpleButtonEvent");
class UI_NotificationManager_Ex1 extends core_1.Component {
    //region preStart()
    preStart() {
        this.notificationManager = this.world.getEntitiesWithTags(["UI_NotifyManager"])[0];
        if (!this.notificationManager) {
            console.error("UI_NotifyManager not found");
        }
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            //first empty array will show Notification to everyone, eventually
            this.showNotification(this.props.customMessage, [], this.props.customImg ?? null);
        });
        this.connectNetworkEvent(this.entity, UI_SimpleButtonEvent_1.simpleButtonEvent, (data) => {
            const player = data.player;
            const message = `${player.name.get()} pressed Simple Button!`;
            this.showNotification(message, [player], this.props.customImg ?? null);
        });
    }
    start() { }
    //region showNotification()
    showNotification(message, players, imgAsset = null) {
        const imgTextureID = imgAsset ? imgAsset.id.toString() : null;
        console.log(`imgTextureID is null: ${imgTextureID === null}`);
        if (this.notificationManager) {
            this.sendNetworkEvent(this.notificationManager, UI_NotificationManager_1.NotificationEvent, {
                message: message,
                players: players,
                imageAssetId: imgTextureID,
            });
        }
    }
}
UI_NotificationManager_Ex1.propsDefinition = {
    enabled: { type: core_1.PropTypes.Boolean, default: true },
    customMessage: { type: core_1.PropTypes.String, default: "Default notification message" },
    customImg: { type: core_1.PropTypes.Asset, default: null },
};
core_1.Component.register(UI_NotificationManager_Ex1);
