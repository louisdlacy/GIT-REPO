import * as hz from 'horizon/core';
import { SetTextGizmoText } from 'sysUtils';

// TODO: Disable HWXS Grab Relax Animation in the property panel of grabbable objects
class FeaturesLab_HolsterExample extends hz.Component<typeof FeaturesLab_HolsterExample> {
  static propsDefinition = {
    holsterExampleText: {type: hz.PropTypes.Entity},
    objectToHolster1: {type: hz.PropTypes.Entity},
    objectToHolster2: {type: hz.PropTypes.Entity},
    objectToHolster3: {type: hz.PropTypes.Entity},
  };

  private activePlayer!: hz.Player;
  private objectsToHolster: hz.Entity[] = [];
  private objectsOriginalPositions: hz.Vec3[] = [];
  private objectsOriginalRotations: hz.Quaternion[] = [];

  start() {
    this.activePlayer = this.world.getServerPlayer();

    if (this.props.objectToHolster1 !== undefined) {
      this.objectsToHolster.push(this.props.objectToHolster1);
      this.objectsOriginalPositions.push(this.props.objectToHolster1.position.get());
      this.objectsOriginalRotations.push(this.props.objectToHolster1.rotation.get());
    }
    if (this.props.objectToHolster2 !== undefined) {
      this.objectsToHolster.push(this.props.objectToHolster2);
      this.objectsOriginalPositions.push(this.props.objectToHolster2.position.get());
      this.objectsOriginalRotations.push(this.props.objectToHolster2.rotation.get());
    }
    if (this.props.objectToHolster3 !== undefined) {
      this.objectsToHolster.push(this.props.objectToHolster3);
      this.objectsOriginalPositions.push(this.props.objectToHolster3.position.get());
      this.objectsOriginalRotations.push(this.props.objectToHolster3.rotation.get());
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.activePlayer === this.world.getServerPlayer()) {
        this.activePlayer = player;
        this.objectsToHolster.forEach(object => {
          object?.as(hz.AttachableEntity)?.attachToPlayer(player, hz.AttachablePlayerAnchor.Torso);
          object?.as(hz.GrabbableEntity)?.setWhoCanGrab([player]);

          // Reset object position and rotation when it is detached
          this.connectCodeBlockEvent(object, hz.CodeBlockEvents.OnAttachEnd, () => {
            let index = this.objectsToHolster.indexOf(object);
            object?.position.set(this.objectsOriginalPositions[index]);
            object?.rotation.set(this.objectsOriginalRotations[index]);
          });
        });
        SetTextGizmoText(this.props.holsterExampleText, `Holster multiple objects<br><br>Objects being used by ${this.activePlayer.name.get()}<br>Press the button again to unequip the objects`);
      } else if (this.activePlayer === player) {
        this.activePlayer = this.world.getServerPlayer();
        // Force release any grabbed objects and detach them
        this.objectsToHolster.forEach(object => {
          object?.as(hz.GrabbableEntity)?.forceRelease();
          object?.as(hz.GrabbableEntity)?.setWhoCanGrab([]);
          this.connectCodeBlockEvent(object, hz.CodeBlockEvents.OnGrabEnd, () => {
            object?.as(hz.AttachableEntity)?.detach();
          });
        });
        // Detach any remaining objects
        this.objectsToHolster.forEach(object => {
          object?.as(hz.AttachableEntity)?.detach();
        });
        SetTextGizmoText(this.props.holsterExampleText, "Holster multiple objects<br><br>Press the button to equip several objects<br>at the same time");
      }
    });
  }
}
hz.Component.register(FeaturesLab_HolsterExample);
