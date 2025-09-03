"use strict";
/**
 * Made by Proto_XR, 2025
 *
 * Share and enjoy!
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
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
class BounceNavigation extends core_1.Component {
    constructor() {
        super(...arguments);
        this.target = core_1.Vec3.one;
        this.home = core_1.Vec3.zero;
        this.goHome = false;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnEntityCollision, (collidedWith, collisionAt, normal, relativeVelocity, localColliderName, OtherColliderName) => {
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
            const farFromHome = currentPosition.distance(homePos) >= this.props.maxDistanceFromHomeObject;
            // Reduce rotation range if trying to return home or far from home
            const rotationRange = farFromHome || this.goHome ? this.props.rotationLimit / 4 : this.props.rotationLimit;
            // Calculate random direction within rotation range
            const randomDirection = core_1.Quaternion.fromAxisAngle(core_1.Vec3.up, (Math.random() * (0, core_1.degreesToRadians)(rotationRange)) - ((0, core_1.degreesToRadians)(rotationRange / 2)));
            // Set target position with random offset from either home or current position
            this.target = (farFromHome ? homePos : currentPosition).add(core_1.Quaternion.mulVec3(randomDirection, core_1.Vec3.forward.mul((0, core_1.clamp)(Math.random() * 2, 0.5, 2))));
            // Calculate direction vector to target
            const direction = this.target.sub(this.entity.position.get()).normalize();
            // Rotate entity to face the target direction
            this.entity.lookAt(new core_1.Vec3(this.target.x, this.entity.position.get().add(core_1.Quaternion.mulVec3(this.entity.rotation.get(), core_1.Vec3.forward)).y, this.target.z));
            // Apply bounce force after delay
            this.async.setTimeout(() => {
                this.entity.as(core_1.PhysicalEntity).applyForce(core_1.Vec3.up.mul(this.props.multiplier).add(direction.mul(this.props.multiplier)), core_1.PhysicsForceMode.Impulse);
            }, this.props.bounceDelay);
            // Run at random intervals between bounceInterval and 3x bounceInterval
        }, (0, core_1.clamp)(Math.random() * this.props.bounceInterval * 3, this.props.bounceInterval, this.props.bounceInterval * 3));
    }
}
BounceNavigation.propsDefinition = {
    multiplier: { type: core_1.PropTypes.Number, default: 8 },
    rotationLimit: { type: core_1.PropTypes.Number, default: 270 },
    bounceDelay: { type: core_1.PropTypes.Number, default: 100 },
    bounceInterval: { type: core_1.PropTypes.Number, default: 500 },
    maxDistanceFromHomeObject: { type: core_1.PropTypes.Number, default: 10 },
    homeObject: { type: core_1.PropTypes.Entity, default: undefined, required: false },
};
core_1.Component.register(BounceNavigation);
