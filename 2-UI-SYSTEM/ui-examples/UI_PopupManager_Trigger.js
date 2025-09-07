"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const UI_PopupManager_1 = require("UI_PopupManager");
class UI_PopupManager_Trigger extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.sendPopupRequest(player);
        });
        this.connectNetworkEvent(this.entity, UI_PopupManager_1.PopupResponse, (data) => {
            // Handle the popup response
            console.log(`${data.player.name.get()} closed the popup! Time to play some VFX!`);
            if (!this.props.vfx)
                return;
            const vfx = this.props.vfx;
            vfx.position.set(this.entity.position.get());
            this.async.setTimeout(() => {
                vfx.as(core_1.ParticleGizmo)?.play({ players: [data.player] });
            }, 500);
        });
    }
    start() {
        //Use the "UI_PopupManager" tag on the UI Popup Manager to find it.
        this.popupManager = this.world.getEntitiesWithTags(["UI_PopupManager"])[0];
    }
    sendPopupRequest(player) {
        if (!this.popupManager) {
            console.error("Popup Manager not found");
            return;
        }
        this.sendNetworkEvent(this.popupManager, UI_PopupManager_1.PopupRequest, {
            requester: this.entity,
            player: player,
            title: this.props.title,
            message: this.props.message,
        });
    }
}
UI_PopupManager_Trigger.propsDefinition = {
    title: { type: core_1.PropTypes.String, default: "Title" },
    message: { type: core_1.PropTypes.String, default: "Message" },
    // Optional VFX entity to play when the popup is closed
    vfx: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(UI_PopupManager_Trigger);
