"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class Pinata extends core_1.Component {
    constructor() {
        super(...arguments);
        this.startPosition = core_1.Vec3.zero;
        this.ropeTopPosition = core_1.Vec3.zero;
        this.ropeBottomPosition = core_1.Vec3.zero;
        this.ropeScale = core_1.Vec3.one;
        this.swingTimeoutId = -1;
    }
    preStart() {
        this.rope = this.props.rope;
        this.ropeTopPosition = this.rope?.position.get() ?? core_1.Vec3.zero;
        this.ropeScale = this.rope?.scale.get() ?? core_1.Vec3.one;
        this.physicalEntity = this.entity.as(core_1.PhysicalEntity);
        this.vfx = this.props.vfx?.as(core_1.ParticleGizmo);
        this.sfx = this.props.sfx?.as(core_1.AudioGizmo);
        this.startPosition = this.entity.position.get();
        this.stick = this.props.stick;
        if (this.stick) {
            this.connectCodeBlockEvent(this.stick, core_1.CodeBlockEvents.OnGrabStart, (isRightHand, player) => {
                this.stickHolder = player;
            });
            this.connectCodeBlockEvent(this.stick, core_1.CodeBlockEvents.OnGrabEnd, (player) => {
                this.stickHolder = undefined;
            });
            this.connectCodeBlockEvent(this.stick, core_1.CodeBlockEvents.OnIndexTriggerDown, (player) => {
                player.playAvatarGripPoseAnimationByName(core_1.AvatarGripPoseAnimationNames.Fire);
                this.async.clearTimeout(this.swingTimeoutId);
                this.swingTimeoutId = this.async.setTimeout(() => {
                    this.swingTimeoutId = -1;
                }, 500);
            });
        }
        this.connectLocalBroadcastEvent(core_1.World.onPrePhysicsUpdate, () => {
            this.ropeBottomPosition = this.entity.position.get();
            //Place rope between top and bottom positions
            this.rope?.position.set(core_1.Vec3.lerp(this.ropeTopPosition, this.ropeBottomPosition, 0.5));
            const direction = this.ropeBottomPosition.sub(this.ropeTopPosition).normalize();
            const facingRotation = core_1.Quaternion.lookRotation(direction, core_1.Vec3.up);
            //Rotate rope to face the pinata
            this.rope?.rotation.set(facingRotation);
            //Scale rope to match the distance between top and bottom positions
            const scale = this.ropeBottomPosition.sub(this.ropeTopPosition).magnitude();
            this.rope?.scale.set(new core_1.Vec3(this.ropeScale.x, this.ropeScale.z, scale));
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
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnEntityCollision, (entity, collisionAt, normal) => {
            if (!this.stickHolder || this.swingTimeoutId === -1) {
                return;
            }
            this.vfx?.play();
            this.sfx?.play();
            this.swingTimeoutId = -1;
            this.physicalEntity?.applyForceAtPosition(this.stickHolder.forward.get().mul(1000), collisionAt, core_1.PhysicsForceMode.Impulse);
        });
    }
    start() {
    }
}
Pinata.propsDefinition = {
    stick: { type: core_1.PropTypes.Entity },
    rope: { type: core_1.PropTypes.Entity },
    vfx: { type: core_1.PropTypes.Entity },
    sfx: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(Pinata);
