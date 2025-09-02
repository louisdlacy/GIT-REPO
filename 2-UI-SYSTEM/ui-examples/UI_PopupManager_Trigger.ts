import { CodeBlockEvents, Component, Entity, ParticleGizmo, Player, PropTypes } from "horizon/core";
import { PopupRequest, PopupResponse } from "UI_PopupManager";


class UI_PopupManager_Trigger extends Component<typeof UI_PopupManager_Trigger> {
  static propsDefinition = {
    title: { type: PropTypes.String, default: "Title" },
    message: { type: PropTypes.String, default: "Message" },
    // Optional VFX entity to play when the popup is closed
    vfx: { type: PropTypes.Entity },
  };

  // Reference to the Popup Manager entity
  private popupManager!: Entity;

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      this.sendPopupRequest(player);
    });

    this.connectNetworkEvent(this.entity, PopupResponse, (data) => {
      // Handle the popup response
      console.log(`${data.player.name.get()} closed the popup! Time to play some VFX!`);
      if (!this.props.vfx) return;
      const vfx = this.props.vfx;
      vfx.position.set(this.entity.position.get());
      this.async.setTimeout(() => {
        vfx.as(ParticleGizmo)?.play({ players: [data.player] });
      }, 500);
    });
  }

  start() {
    //Use the "UI_PopupManager" tag on the UI Popup Manager to find it.
    this.popupManager = this.world.getEntitiesWithTags(["UI_PopupManager"])[0];
  }

  sendPopupRequest(player: Player) {
    if (!this.popupManager) {
      console.error("Popup Manager not found");
      return;
    }

    this.sendNetworkEvent(this.popupManager, PopupRequest, {
      requester: this.entity,
      player: player,
      title: this.props.title,
      message: this.props.message,
    });
  }
}
Component.register(UI_PopupManager_Trigger);
