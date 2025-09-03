"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_Data_1 = require("Events_Data");
const core_1 = require("horizon/core");
class InvisibleGrabPointOnString_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isGrabbed = false;
        this.launchForward = core_1.Vec3.forward;
        this.bowStringPullDistance = 0.25;
    }
    preStart() {
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, (payload) => { this.onUpdate(payload.deltaTime); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, (isRightHand, player) => { this.grabStart(player, isRightHand); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, (player) => { this.grabEnd(player); });
        this.connectNetworkEvent(this.entity, Events_Data_1.events.networked.yourArrowIs, (payload) => { this.yourArrowIs(payload.arrow); });
    }
    start() {
        if (this.entity.owner.get() !== this.world.getServerPlayer()) {
            this.isGrabbed = true;
        }
    }
    grabStart(player, isRightHand) {
        this.entity.owner.set(player);
        this.props.returnReference?.owner.set(player);
        this.isGrabbed = true;
        if (this.props.arrowManager) {
            this.sendNetworkEvent(this.props.arrowManager, Events_Data_1.events.networked.requestArrow, { requester: this.entity });
        }
    }
    grabEnd(player) {
        this.isGrabbed = false;
        this.arrow?.as(core_1.PhysicalEntity).zeroVelocity();
        const multiplier = Math.min(Math.max(40 * this.bowStringPullDistance, 5), 40);
        this.arrow?.as(core_1.PhysicalEntity).applyForce(this.launchForward.mul(multiplier), core_1.PhysicsForceMode.VelocityChange);
        this.arrow?.as(core_1.PhysicalEntity).gravityEnabled.set(true);
        const tempArrow = this.arrow;
        this.async.setTimeout(() => {
            tempArrow?.collidable.set(true);
        }, 25);
        this.arrow = undefined;
    }
    onUpdate(deltaTime) {
        if (this.props.returnReference) {
            if (!this.isGrabbed) {
                this.entity.position.set(this.props.returnReference.position.get());
            }
            if (this.arrow) {
                if (this.props.frontOfBowReference) {
                    const frontOfBowReferencePos = this.props.frontOfBowReference.position.get();
                    const heldPos = this.entity.position.get();
                    this.launchForward = frontOfBowReferencePos.sub(heldPos).normalize();
                    this.bowStringPullDistance = heldPos.distance(this.props.returnReference.position.get());
                    this.arrow.position.set(heldPos.add(this.launchForward.mul(0.5)));
                    this.arrow.rotation.set(core_1.Quaternion.lookRotation(this.launchForward, core_1.Vec3.up));
                }
            }
        }
    }
    yourArrowIs(arrow) {
        arrow.as(core_1.PhysicalEntity).zeroVelocity();
        arrow.as(core_1.PhysicalEntity).gravityEnabled.set(false);
        arrow.collidable.set(false);
        this.arrow = arrow;
    }
}
InvisibleGrabPointOnString_Entity.propsDefinition = {
    returnReference: { type: core_1.PropTypes.Entity },
    frontOfBowReference: { type: core_1.PropTypes.Entity },
    arrowManager: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(InvisibleGrabPointOnString_Entity);
