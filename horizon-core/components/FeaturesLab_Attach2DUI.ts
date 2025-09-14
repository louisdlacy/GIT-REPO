import * as hz from 'horizon/core';

class FeaturesLab_Attach2DUI extends hz.Component<typeof FeaturesLab_Attach2DUI> {
  static propsDefinition = {
    hud: {type: hz.PropTypes.Entity},
  };

  private originalPos: hz.Vec3 = new hz.Vec3(0, 0, 0);
  private originalRot: hz.Quaternion = new hz.Quaternion(0, 0, 0, 0);
  private originalScale: hz.Vec3 = new hz.Vec3(0, 0, 0);

  start() {
    const hud: hz.Entity | undefined = this.props.hud;
    if (hud === undefined) return;

    this.originalPos = hud.position.get();
    this.originalRot = hud.rotation.get();
    this.originalScale = hud.scale.get();

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      hud.as(hz.AttachableEntity)?.attachToPlayer(player, hz.AttachablePlayerAnchor.Torso);
      hud.setVisibilityForPlayers([player], hz.PlayerVisibilityMode.VisibleTo);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player: hz.Player) => {
      hud.as(hz.AttachableEntity)?.detach();
      hud.resetVisibilityForPlayers();
    });

    this.connectCodeBlockEvent(hud, hz.CodeBlockEvents.OnAttachEnd, (player: hz.Player) => {
      hud.position.set(this.originalPos);
      hud.rotation.set(this.originalRot);
      hud.scale.set(this.originalScale);
    });
  }
}
hz.Component.register(FeaturesLab_Attach2DUI);
