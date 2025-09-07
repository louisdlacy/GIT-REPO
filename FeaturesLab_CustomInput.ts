import { AttachmentListRequest, AttachmentListResponse } from "AutoAttachListByTag";
import * as hz from "horizon/core";
import { CustomInputEvent, PlayerTracker } from "PlayerTracker";
import { getEntityListByTag } from "sysHelper";

class FeaturesLab_CustomInput extends hz.Component<typeof FeaturesLab_CustomInput> {
  static propsDefinition = {
    playerIndex: { type: hz.PropTypes.Number },
    CustomInputText: { type: hz.PropTypes.Entity },
  };

  private fireInput?: hz.PlayerInput;

  playerTracker: hz.Entity | null = null;

  preStart() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      (player: hz.Player) => {
        if (player.index.get() !== this.props.playerIndex) return;

        this.entity.owner.set(player);
      }
    );

    if (this.entity.owner.get() !== this.world.getServerPlayer()) {
      this.connectNetworkEvent(this.entity, AttachmentListResponse, (data) => {
        this.playerTracker = data.attachments[this.props.playerIndex];
        if (!this.playerTracker) {
          console.error("No PlayerTracker found on attached entity");
        }
      });
    }
  }

  start() {
    if (this.entity.owner.get() !== this.world.getServerPlayer()) {
      this.async.setTimeout(() => {
        const playerAttacher = getEntityListByTag("playerAttacher", this.world)[0];
        if (!playerAttacher) {
          console.error("No playerAttacher found");
          return;
        }
        this.sendNetworkEvent(playerAttacher, AttachmentListRequest, { requester: this.entity });
      }, 1000);

      if (hz.PlayerControls.isInputActionSupported(hz.PlayerInputAction.RightTrigger)) {
        this.fireInput = hz.PlayerControls.connectLocalInput(
          hz.PlayerInputAction.RightTrigger,
          hz.ButtonIcon.Fire,
          this,
          { preferredButtonPlacement: hz.ButtonPlacement.Default }
        );
        this.fireInput.registerCallback((action, pressed) => {
          if (this.playerTracker && pressed) {
            console.log(`Fire input ${pressed ? "pressed" : "released"}`);
            this.sendNetworkEvent(this.playerTracker, CustomInputEvent, {
              action: "attack",
              pressed: pressed,
            });
          }
        });
      }
    }
  }
}
hz.Component.register(FeaturesLab_CustomInput);
