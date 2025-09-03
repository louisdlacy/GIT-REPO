"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class SpreadActions extends core_1.Component {
    constructor() {
        super(...arguments);
        this.actionsQueue = [];
        this.actionPosition = core_1.Vec3.zero;
    }
    preStart() {
        this.particle = this.props.particle?.as(core_1.ParticleGizmo);
        this.audio = this.props.audio?.as(core_1.AudioGizmo);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnIndexTriggerDown, this.onTriggerDown.bind(this));
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdate.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onTriggerDown() {
        this.actionsQueue.push(() => {
            this.actionPosition = this.entity.position.get();
        });
        this.actionsQueue.push(() => {
            this.entity.position.set(this.actionPosition);
        });
        this.actionsQueue.push(() => {
            this.particle?.play();
        });
        this.actionsQueue.push(() => {
            this.entity.position.set(this.actionPosition);
        });
        this.actionsQueue.push(() => {
            this.audio?.play();
        });
    }
    onUpdate(data) {
        if (this.actionsQueue.length === 0) {
            return;
        }
        const action = this.actionsQueue.shift();
        if (action) {
            action();
        }
    }
}
SpreadActions.propsDefinition = {
    particle: { type: core_1.PropTypes.Entity },
    audio: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(SpreadActions);
