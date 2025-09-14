/**
 * Made by Proto_XR, 2025
 * 
 * Share and enjoy!
 */

import { clamp, CodeBlockEvents, Component, degreesToRadians, Entity, GrabbableEntity, LocalEvent, PhysicalEntity, PhysicsForceMode, Player, PropTypes, Quaternion, Vec3, World } from 'horizon/core';

/**
 * A component that makes entities bounce and navigate through the environment.
 * 
 * BounceNavigation creates a physics-based movement pattern where the entity bounces
 * in semi-random directions. When the entity collides with something or moves too far
 * from its home position, it will attempt to return home.
 * 
 * @remarks
 * This component requires the entity to have a PhysicalEntity component to apply forces.

 * 
 * @property multiplier - Force multiplier applied to bounces. Higher values make jumps stronger.
 * @property rotationLimit - Maximum rotation angle in degrees when choosing random directions.
 * @property bounceDelay - Milliseconds to wait before applying the bounce force after selecting direction.
 * @property bounceInterval - Base milliseconds between bounce actions.
 * @property maxDistanceFromHomeObject - Maximum allowed distance from home before attempting to return.
 * @property homeObject - Optional reference entity that defines the home position. If not provided, initial position is used.
 */
class BounceNavigation extends Component<typeof BounceNavigation> {
  static propsDefinition = {
    multiplier: { type: PropTypes.Number, default: 8 },
    rotationLimit: { type: PropTypes.Number, default: 270 },
    bounceDelay: { type: PropTypes.Number, default: 100 },
    bounceInterval: { type: PropTypes.Number, default: 500 },
    maxDistanceFromHomeObject: { type: PropTypes.Number, default: 10 },
    homeObject: { type: PropTypes.Entity, default: undefined, required: false },
  };

  private target: Vec3 = Vec3.one;
  private home: Vec3 = Vec3.zero;
  private goHome: boolean = false;

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnEntityCollision, (collidedWith: Entity, collisionAt: Vec3, normal: Vec3, relativeVelocity: Vec3, localColliderName: string, OtherColliderName: string) => {
      this.goHome = true;
    });
  }

  async start() {
    // Store the initial home position from homeObject or current entity position
    this.home = this.props.homeObject ? this.props.homeObject.position.get() : this.entity.position.get();
    // Set up a repeating interval for bounce behavior
    this.async.setInterval(async () => {
      // Get current position of the entity
      const currentPosition = this.entity.position.get();
      // Update home position (in case homeObject has moved)
      let homePos = this.props.homeObject ? this.props.homeObject.position.get() : this.home;
      // Reset goHome flag if we're close to home
      if (currentPosition.distance(homePos) < 1 && this.goHome) {
        this.goHome = false;
      }
      // Check if entity is far from home based on max distance property
      const farFromHome: boolean = currentPosition.distance(homePos) >= this.props.maxDistanceFromHomeObject;
      // Reduce rotation range if trying to return home or far from home
      const rotationRange = farFromHome || this.goHome ? this.props.rotationLimit/4 : this.props.rotationLimit;
      // Calculate random direction within rotation range
      const randomDirection = Quaternion.fromAxisAngle(Vec3.up, (Math.random() * degreesToRadians(rotationRange))-(degreesToRadians(rotationRange/2)));
      // Set target position with random offset from either home or current position
      this.target = (farFromHome ? homePos : currentPosition).add(Quaternion.mulVec3(randomDirection, Vec3.forward.mul(clamp(Math.random() * 2, 0.5, 2))));
      // Calculate direction vector to target
      const direction = this.target.sub(this.entity.position.get()).normalize();
      // Rotate entity to face the target direction
      this.entity.lookAt(new Vec3(this.target.x, this.entity.position.get().add(Quaternion.mulVec3(this.entity.rotation.get(), Vec3.forward)).y, this.target.z));
      // Apply bounce force after delay
      this.async.setTimeout(() => {
        this.entity.as(PhysicalEntity).applyForce(Vec3.up.mul(this.props.multiplier).add(direction.mul(this.props.multiplier)), PhysicsForceMode.Impulse);
      }, this.props.bounceDelay);
    // Run at random intervals between bounceInterval and 3x bounceInterval
    }, clamp(Math.random() * this.props.bounceInterval * 3, this.props.bounceInterval, this.props.bounceInterval * 3));
  }

}
Component.register(BounceNavigation);