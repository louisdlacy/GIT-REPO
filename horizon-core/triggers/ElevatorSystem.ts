import { Component, PropTypes, Entity, Vec3, World, NetworkEvent, Player, CodeBlockEvents, Asset, SpawnController, Quaternion } from 'horizon/core';

// Network event to start the movement from any client
export const StartMovementEvent = new NetworkEvent('startMovement');
// Network events for speed control
export const IncreaseSpeedEvent = new NetworkEvent('increaseSpeed');
export const DecreaseSpeedEvent = new NetworkEvent('decreaseSpeed');

class ElevatorSystem extends Component<typeof ElevatorSystem> {
  static propsDefinition = {
    target: { type: PropTypes.Entity },
    keyframes: { type: PropTypes.EntityArray },
    speed: { type: PropTypes.Number, default: 2.0 },
    editModeEnabled: { type: PropTypes.Boolean, default: false },
    keyframeMarker: { type: PropTypes.Asset },
  };

  private isMoving = false;
  private currentKeyframeIndex = 0;
  private keyframePositions: Vec3[] = [];
  private spawnedKeyframes: Entity[] = [];
  private currentSpeed: number = 2.0;

  override preStart() {
    // Listen for the trigger event to either start movement or spawn a keyframe
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => {
      this.handleTrigger(player);
    });

    // Listen for the network event to start movement
    this.connectNetworkEvent(this.entity, StartMovementEvent, () => this.startMovement());
    // Listen for speed control events
    this.connectNetworkEvent(this.entity, IncreaseSpeedEvent, () => this.increaseSpeed());
    this.connectNetworkEvent(this.entity, DecreaseSpeedEvent, () => this.decreaseSpeed());
  }

  override start() {
    // Initialize speed from props
    this.currentSpeed = this.props.speed;
    // Initialize keyframe positions from the properties
    this.updateKeyframePositions();

    // Connect to the world update loop for movement
    this.connectLocalBroadcastEvent(World.onUpdate, (data) => {
      if (this.isMoving) {
        this.updateMovement(data.deltaTime);
      }
    });
  }

  private increaseSpeed() {
    this.currentSpeed += 0.5;
    console.log(`Elevator speed increased to: ${this.currentSpeed}`);
  }

  private decreaseSpeed() {
    // Ensure speed doesn't go below the minimum
    this.currentSpeed = Math.max(0.5, this.currentSpeed - 0.5);
    console.log(`Elevator speed decreased to: ${this.currentSpeed}`);
  }

  private updateKeyframePositions() {
    // Use spawned keyframes if they exist, otherwise use the ones from props
    const keyframeEntities = this.spawnedKeyframes.length > 0 ? this.spawnedKeyframes : this.props.keyframes;
    if (keyframeEntities) {
      this.keyframePositions = keyframeEntities.map(kf => kf.position.get());
    }
  }

  private async handleTrigger(player: Player) {
    if (this.props.editModeEnabled) {
      await this.spawnKeyframe(player.position.get());
    } else {
      this.sendNetworkEvent(this.entity, StartMovementEvent, {});
    }
  }

  private async spawnKeyframe(position: Vec3) {
    if (!this.props.keyframeMarker) {
      console.error("ElevatorSystem: 'keyframeMarker' asset is not set for edit mode.");
      return;
    }

    const spawnController = new SpawnController(
      this.props.keyframeMarker,
      position,
      Quaternion.one,
      Vec3.one
    );

    await spawnController.load();
    await spawnController.spawn();
    const spawned = spawnController.rootEntities.get();

    if (spawned && spawned.length > 0) {
      this.spawnedKeyframes.push(spawned[0]);
      this.updateKeyframePositions(); // Refresh the path with the new keyframe
      console.log(`Spawned keyframe #${this.spawnedKeyframes.length}. Path updated.`);
    }
  }

  private startMovement() {
    if (!this.props.target) {
      console.error("ElevatorSystem: 'target' entity is not set.");
      return;
    }
    if (this.keyframePositions.length === 0) {
      console.error("ElevatorSystem: No keyframes are defined.");
      return;
    }
    this.isMoving = true;
    this.currentKeyframeIndex = 0;
  }

  private updateMovement(deltaTime: number) {
    if (!this.props.target || this.keyframePositions.length === 0) {
      this.isMoving = false;
      return;
    }

    const targetKeyframePos = this.keyframePositions[this.currentKeyframeIndex];
    const currentPos = this.props.target.position.get();
    const distanceToKeyframe = currentPos.distance(targetKeyframePos);

    // If close enough, move to the next keyframe
    if (distanceToKeyframe < 0.1) {
      this.currentKeyframeIndex = (this.currentKeyframeIndex + 1) % this.keyframePositions.length;
      return;
    }

    // Move towards the current keyframe
    const direction = targetKeyframePos.sub(currentPos).normalize();
    const moveVector = direction.mul(this.currentSpeed * deltaTime);
    this.props.target.position.set(currentPos.add(moveVector));
  }
}

Component.register(ElevatorSystem);