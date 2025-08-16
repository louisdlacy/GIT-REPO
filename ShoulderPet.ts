import { AttachableEntity, AttachablePlayerAnchor, ButtonIcon, Component, Entity, Player, PlayerControls, PlayerInput, PlayerInputAction, PropTypes, Vec3, World } from "horizon/core";

class LocalManager extends Component<typeof LocalManager> {
  static propsDefinition = {
    local: { type: PropTypes.Entity }
  };

  preStart() {
    this.props.local?.owner?.set(this.entity.owner.get());
  }

  start() { }
}
Component.register(LocalManager);

class ShoulderPet extends Component<typeof ShoulderPet> {
  static propsDefinition = {
    shoulderAnchor: { type: PropTypes.Entity },
    pet: { type: PropTypes.Entity },
  };

  shouldShow = false;

  action?: PlayerInput;

  owner?: Player;

  serverPlayer?: Player;

  shoulderAnchor?: Entity;

  pet?: Entity;

  timeElapsed = 0;

  maxTime = 2;

  preStart() {
    this.owner = this.entity.owner.get();

    this.serverPlayer = this.world.getServerPlayer();

    if (this.owner === this.serverPlayer) {
      return;
    }

    this.shoulderAnchor = this.props.shoulderAnchor;

    this.pet = this.props.pet;

    this.entity.visible.set(false);

    this.entity.as(AttachableEntity).attachToPlayer(this.entity.owner.get(), AttachablePlayerAnchor.Torso);

    const showPetInput = PlayerControls.connectLocalInput(PlayerInputAction.RightPrimary, ButtonIcon.Ability, this)

    showPetInput.registerCallback((action, pressed) => {
      if (pressed) {
        this.shouldShow = !this.shouldShow;
        this.entity.visible.set(this.shouldShow)
      }
    });

    this.connectLocalBroadcastEvent(World.onUpdate, (data: { deltaTime: number }) => {
      if (!this.shouldShow) {
        return;
      }

      this.timeElapsed = (this.timeElapsed + data.deltaTime) % this.maxTime;
      const alpha = (this.timeElapsed / this.maxTime);
      const y = Math.sin(alpha * Math.PI * 2) * 0.1; // Oscillate up and down
      const newPosition = this.shoulderAnchor?.position.get().add(new Vec3(0, y, 0)) ?? Vec3.zero;
      this.pet?.position.set(newPosition);
    });
  }

  start() {

  }
}
Component.register(ShoulderPet);