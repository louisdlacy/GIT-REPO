import * as hz from 'horizon/core';

// TODO: Disable HWXS Grab Relax Animation in the property panel of grabbable objects
class FeaturesLab_HolsterItem extends hz.Component<typeof FeaturesLab_HolsterItem> {
  static propsDefinition = {
    attachPositionOffset: { type: hz.PropTypes.Vec3 },
    attachPositionRotation: { type: hz.PropTypes.Vec3 },
  };

  start() {
    let attachableEntity = this.entity.as(hz.AttachableEntity);

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, (player: hz.Player) => {
      attachableEntity?.attachToPlayer(player, hz.AttachablePlayerAnchor.Torso);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnAttachStart, (player: hz.Player) => {
      attachableEntity?.socketAttachmentPosition.set(this.props.attachPositionOffset);
      attachableEntity?.socketAttachmentRotation.set(hz.Quaternion.fromEuler(this.props.attachPositionRotation));
    });
  }
}
hz.Component.register(FeaturesLab_HolsterItem);
