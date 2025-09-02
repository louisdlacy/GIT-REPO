import { AudioGizmo, AvatarGripPoseAnimationNames, CodeBlockEvents, Component, Entity, ParticleGizmo, PhysicalEntity, PhysicsForceMode, Player, PropTypes, Quaternion, Vec3, World } from 'horizon/core';

class Pinata extends Component<typeof Pinata> {
  static propsDefinition = {
    stick: { type: PropTypes.Entity },
    rope: { type: PropTypes.Entity },
    vfx: { type: PropTypes.Entity },
    sfx: { type: PropTypes.Entity },
  };

  physicalEntity?: PhysicalEntity;

  startPosition = Vec3.zero;

  rope?: Entity;
  ropeTopPosition = Vec3.zero;
  ropeBottomPosition = Vec3.zero;
  ropeScale = Vec3.one;

  stick?: Entity;
  stickHolder?: Player;

  vfx?: ParticleGizmo;
  sfx?: AudioGizmo;

  swingTimeoutId = -1;

  preStart() {
    this.rope = this.props.rope;
    this.ropeTopPosition = this.rope?.position.get() ?? Vec3.zero;
    this.ropeScale = this.rope?.scale.get() ?? Vec3.one;

    this.physicalEntity = this.entity.as(PhysicalEntity);

    this.vfx = this.props.vfx?.as(ParticleGizmo);
    this.sfx = this.props.sfx?.as(AudioGizmo);

    this.startPosition = this.entity.position.get();

    this.stick = this.props.stick;
    if (this.stick) {
      this.connectCodeBlockEvent(this.stick, CodeBlockEvents.OnGrabStart, (isRightHand: boolean, player: Player) => {
        this.stickHolder = player;
      });

      this.connectCodeBlockEvent(this.stick, CodeBlockEvents.OnGrabEnd, (player: Player) => {
        this.stickHolder = undefined;
      });

      this.connectCodeBlockEvent(this.stick, CodeBlockEvents.OnIndexTriggerDown, (player: Player) => {
        player.playAvatarGripPoseAnimationByName(AvatarGripPoseAnimationNames.Fire);
        this.async.clearTimeout(this.swingTimeoutId);
        this.swingTimeoutId = this.async.setTimeout(() => {
          this.swingTimeoutId = -1;
        }, 500);
      })
    }

    this.connectLocalBroadcastEvent(World.onPrePhysicsUpdate, () => {
      this.ropeBottomPosition = this.entity.position.get();

      //Place rope between top and bottom positions
      this.rope?.position.set(Vec3.lerp(this.ropeTopPosition, this.ropeBottomPosition, 0.5));

      const direction = this.ropeBottomPosition.sub(this.ropeTopPosition).normalize();
      const facingRotation = Quaternion.lookRotation(direction, Vec3.up);

      //Rotate rope to face the pinata
      this.rope?.rotation.set(facingRotation);

      //Scale rope to match the distance between top and bottom positions
      const scale = this.ropeBottomPosition.sub(this.ropeTopPosition).magnitude();
      this.rope?.scale.set(new Vec3(this.ropeScale.x, this.ropeScale.z, scale));

      //Move Pinata back to start position
      this.physicalEntity?.springPushTowardPosition(this.startPosition, {
        damping: 0.4,
        stiffness: 5,
        axisIndependent: true,
      });

      //Sprng rotate pinata to face the rope
      this.physicalEntity?.springSpinTowardRotation(facingRotation, {
        damping: 0.99,
        stiffness: 10,
        axisIndependent: true,
      });
    });

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnEntityCollision, (entity: Entity, collisionAt: Vec3, normal: Vec3) => {
      if (!this.stickHolder || this.swingTimeoutId === -1) {
        return;
      }

      this.vfx?.play();
      this.sfx?.play();
      
      this.swingTimeoutId = -1;
      this.physicalEntity?.applyForceAtPosition(this.stickHolder.forward.get().mul(1000), collisionAt, PhysicsForceMode.Impulse);
    });
  }

  start() {

  }
}
Component.register(Pinata);