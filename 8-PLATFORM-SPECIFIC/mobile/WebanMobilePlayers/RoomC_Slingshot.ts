import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

class RoomC_Slingshot extends hz.Component<typeof RoomC_Slingshot> {
  static propsDefinition = {
    raycast: { type: hz.PropTypes.Entity },
    slingshotBall: { type: hz.PropTypes.Entity },
    slingshotPouch: { type: hz.PropTypes.Entity },
    maxForce: { type: hz.PropTypes.Number, default: 30 },
    cooldownTime: { type: hz.PropTypes.Number, default: 2 },
  };

  private activePlayer!: hz.Player;
  private cooldown: boolean = false;

  start() {
    // Set properties for managing Focused Interaction
    this.activePlayer = this.world.getServerPlayer();
    const cameraPos = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 1, 5));
    const cameraRot = hz.Quaternion.fromEuler(new hz.Vec3(0, 180, 0));

    // Set Slingshot initial values for variables shared across focused interaction states
    const raycast: hz.Entity | undefined = this.props.raycast;
    const ball: hz.Entity | undefined = this.props.slingshotBall;
    const pouch: hz.Entity | undefined = this.props.slingshotPouch;
    let ballStartPosition = hz.Vec3.zero;
    let pouchStartPosition = hz.Vec3.zero;
    let deltaPouchBall = hz.Vec3.zero;
    let touching: boolean = false;

    // Catch missing properties
    if (raycast === undefined || raycast === null) {
      throw new Error('Slingshot requires a raycast');
    }
    if (ball === undefined || ball === null || pouch === undefined || pouch === null) {
      throw new Error('Slingshot requires a ball and pouch');
    } else {
      // Set ball and pouch start positions to spring back when the slingshot is not in use
      ball.simulated.set(false);
      ballStartPosition = ball.position.get();
      pouch.simulated.set(false);
      pouchStartPosition = pouch.position.get();
      // Calculate the offset between the pouch and ball positions
      deltaPouchBall = ballStartPosition.sub(pouchStartPosition);
      // Cancel any first-frame movement from physics
      this.async.setTimeout(() => {
        ball.position.set(ballStartPosition);
        pouch.position.set(pouchStartPosition);
      }, 1);
    }

    // When a player interacts with the object, enter Focused Interaction mode
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR) {
        this.activePlayer = player;
        this.sendNetworkEvent(player, sysEvents.OnStartFocusMode, { exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot });
      }
    });

    // Reset status after a player exits Focused Interaction mode
    this.connectNetworkEvent(this.entity, sysEvents.OnExitFocusMode, (data) => {
      if (this.activePlayer.id === data.player.id) {
        this.activePlayer = this.world.getServerPlayer();
      }
    });

    // When mobile/desktop player touches the screen, move the ball and pouch to the touch position
    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputStarted, (data) => {
      if (this.cooldown) return; // Check cooldown status
      const interaction = data.interactionInfo;
      if (interaction !== undefined && interaction.interactionIndex === 0) {
        // Check player touched the interaction plane
        const hitResult = raycast?.as(hz.RaycastGizmo)?.raycast(interaction.worldRayOrigin, interaction.worldRayDirection, {layerType: hz.LayerType.Objects});
        if (hitResult !== null && hitResult?.targetType === hz.RaycastTargetType.Entity){
          // Player touched the touch plane
          // Zero ball and pouch velocity as player is now in control
          ball?.as(hz.PhysicalEntity)?.zeroVelocity();
          pouch?.as(hz.PhysicalEntity)?.zeroVelocity();
          ball?.collidable.set(false);
          // Set the touching flag
          touching = true;
          // Disable ball and pouch simulation next frame (after the velocity has been set to zero)
          this.async.setTimeout(() => {
            ball?.simulated.set(false);
            pouch?.simulated.set(false);
          }, 1);
        }
      }
    });

    // When mobile/desktop player moves the touch, move the ball and pouch
    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputMoved, (data) => {
      if (this.cooldown) return; // Check cooldown status
      const interaction = data.interactionInfo;
      if (interaction !== undefined && interaction.interactionIndex === 0) {
        // Check player touched the interaction plane
        const hitResult = raycast?.as(hz.RaycastGizmo)?.raycast(interaction.worldRayOrigin, interaction.worldRayDirection, {layerType: hz.LayerType.Objects});
        if (hitResult !== null && hitResult?.targetType === hz.RaycastTargetType.Entity){
          // Move ball and pouch to the touch position
          ball?.position.set(hitResult.hitPoint);
          pouch?.position.set(hitResult.hitPoint.sub(deltaPouchBall));
        }
      }
    });

    // When mobile/desktop player releases the touch, apply force to the ball
    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputEnded, (data) => {
      if (this.cooldown) return; // Check cooldown status
      const interaction = data.interactionInfo;
      if (interaction?.interactionIndex !== 0) return;

      const ballPosition = ball?.position.get();
      if (ballPosition === undefined) {
        throw new Error("There was an error retrieving ball position in OnFocusedInteractionInputEnded. Is the ball prop set?");
      }

      // Calculate vector for force application and enable physics
      const deltaVector = ballPosition.sub(ballStartPosition);
      if (ball) ball.simulated.set(true);
      if (pouch) pouch.simulated.set(true);

      // Apply force to ball after a delay, then enable collision
      const collisionEnableDelay = 200;
      this.async.setTimeout(() => {
        if (ball) ball.as(hz.PhysicalEntity).applyForce(deltaVector.mul(-1 * this.props.maxForce), hz.PhysicsForceMode.Impulse);
      }, collisionEnableDelay / 2);

      this.async.setTimeout(() => {
        if (ball) ball.collidable.set(true);
      }, collisionEnableDelay);

      touching = false;
      this.cooldown = true; // Set cooldown to true

      // Reset cooldown after a delay
      this.async.setTimeout(() => {
        this.cooldown = false;
      }, this.props.cooldownTime * 1000);
    });

    // Update the pouch position every frame using a spring to give it an elastic band effect
    // When the player is not interacting with the slingshot, spring the pouch towards it's start position every update.
    this.connectLocalBroadcastEvent(hz.World.onUpdate, () => {
      if (!touching) {
        pouch?.as(hz.PhysicalEntity)?.springPushTowardPosition(pouchStartPosition, {stiffness: 20, damping: 0.2});
      }
    });
  }
}
hz.Component.register(RoomC_Slingshot);
