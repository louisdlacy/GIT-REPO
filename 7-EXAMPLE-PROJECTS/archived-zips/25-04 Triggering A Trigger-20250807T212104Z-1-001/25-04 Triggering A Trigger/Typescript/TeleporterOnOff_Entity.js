"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class TrigOnOff_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isOn = false;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
    }
    start() {
    }
    playerEnterTrigger(player) {
        this.isOn = !this.isOn;
        this.props.triggerToEffect?.as(core_1.TriggerGizmo).enabled.set(this.isOn);
        if (this.isOn) {
            this.props.vfx?.as(core_1.ParticleGizmo).play();
            this.props.tintAble?.as(core_1.MeshEntity).style.tintColor.set(core_1.Color.green);
        }
        else {
            this.props.vfx?.as(core_1.ParticleGizmo).stop();
            this.props.tintAble?.as(core_1.MeshEntity).style.tintColor.set(core_1.Color.red);
        }
    }
}
TrigOnOff_Entity.propsDefinition = {
    triggerToEffect: { type: core_1.PropTypes.Entity },
    vfx: { type: core_1.PropTypes.Entity },
    tintAble: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(TrigOnOff_Entity);
