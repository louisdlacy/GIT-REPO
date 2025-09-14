import { DamageEvent } from 'HealthEvents';
import { AudioGizmo, AvatarGripPoseAnimationNames, CodeBlockEvents, Component, Entity, Player, PlayerBodyPart, PlayerBodyPartType, PropTypes, Quaternion, Space, TriggerGizmo, Vec3, World } from 'horizon/core';

class ChickenWhacker extends Component<typeof ChickenWhacker> {
  static propsDefinition = {
    hitBox: { type: PropTypes.Entity },
    hitBoxContainer: { type: PropTypes.Entity },
    sfx: { type: PropTypes.Entity },
    damage: { type: PropTypes.Number, default: 25 }
  };

  owner?: Player;

  hitBox?: TriggerGizmo;

  hitBoxContainer?: Entity;

  hitBoxOffset = Vec3.zero;

  sfx?: AudioGizmo;

  touchedEntities: Set<Entity> = new Set();

  start() {
    this.owner = this.entity.owner.get();

    this.hitBox = this.props.hitBox?.as(TriggerGizmo);
    this.hitBox?.owner.set(this.owner);

    this.hitBoxContainer = this.props.hitBoxContainer;
    this.hitBoxContainer?.owner.set(this.owner);

    this.sfx = this.props.sfx?.as(AudioGizmo);
    this.sfx?.owner.set(this.owner);

    if (this.owner === this.world.getServerPlayer()) {
      return;
    }

    this.hitBoxOffset = Vec3.forward.mul(0.5).add(Vec3.down.mul(0.4));

    if (this.hitBox) {
      this.connectCodeBlockEvent(this.hitBox, CodeBlockEvents.OnEntityEnterTrigger, this.onTouchStart);
      this.connectCodeBlockEvent(this.hitBox, CodeBlockEvents.OnEntityExitTrigger, this.onTouchEnd);
    }

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnIndexTriggerDown, this.onSwing);

    this.connectLocalBroadcastEvent(World.onUpdate, this.onUpdate);
  }

  onTouchStart = (entity: Entity) => {
    //console.log(`Entity ${entity.name} touched the hitbox.`);
    if (this.touchedEntities.has(entity)) {
      return;
    }

    this.touchedEntities.add(entity);
  }

  onTouchEnd = (entity: Entity) => {
    this.touchedEntities.delete(entity);
  }

  onSwing = (player: Player) => {
    player.playAvatarGripPoseAnimationByName(AvatarGripPoseAnimationNames.Fire);
    
    this.sfx?.play();

    const entities = Array.from(this.touchedEntities.values());
    //console.log(entities);
    
    // Damage all entities currently in the hitbox
    for (const entity of entities) {
      //console.log(`Swing hit entity: ${entity.name.get()}`);
      this.sendNetworkEvent(entity, DamageEvent, { amount: this.props.damage });
    }
  }

  onUpdate = () => {
    if (!this.owner || !this.hitBoxContainer) {
      return;
    }

    this.hitBoxContainer?.moveRelativeToPlayer(this.owner, PlayerBodyPartType.Head, this.hitBoxOffset, Space.Local);
    this.hitBoxContainer?.rotateRelativeToPlayer(this.owner, PlayerBodyPartType.Head, Quaternion.zero, Space.Local);
  }
}
Component.register(ChickenWhacker);