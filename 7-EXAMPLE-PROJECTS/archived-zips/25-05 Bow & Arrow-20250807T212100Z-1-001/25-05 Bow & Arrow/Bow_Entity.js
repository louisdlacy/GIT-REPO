"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class Bow_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.setTimeoutID = 0;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, (isRightHand, player) => { this.grabStart(player, isRightHand); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, (player) => { this.grabEnd(player); });
    }
    start() {
    }
    grabStart(player, isRightHand) {
        this.async.clearTimeout(this.setTimeoutID);
        this.entity.owner.set(player);
        this.props.returnRef?.owner.set(player);
    }
    grabEnd(player) {
        this.setTimeoutID = this.async.setTimeout(() => { this.returnToOrg(); }, this.props.returnDelayMs);
    }
    returnToOrg() {
        if (this.props.returnRef) {
            this.entity.position.set(this.props.returnRef.position.get());
            this.entity.rotation.set(this.props.returnRef.rotation.get());
        }
    }
}
Bow_Entity.propsDefinition = {
    returnRef: { type: core_1.PropTypes.Entity },
    returnDelayMs: { type: core_1.PropTypes.Number, default: 5000 },
};
core_1.Component.register(Bow_Entity);
