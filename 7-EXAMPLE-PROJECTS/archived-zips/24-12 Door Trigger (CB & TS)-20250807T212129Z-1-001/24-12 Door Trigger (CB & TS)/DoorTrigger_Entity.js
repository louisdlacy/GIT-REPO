"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const UtilArray_Func_1 = require("UtilArray_Func");
const UtilMotionOverTime_Func_1 = require("UtilMotionOverTime_Func");
class DoorTrigger_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.orgPos = core_1.Vec3.zero;
        this.destPos = core_1.Vec3.zero;
        this.playersInMe = [];
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.playerEnterTrigger.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitTrigger, this.playerExitTrigger.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, this.playerExitWorld.bind(this));
    }
    start() {
        this.orgPos = this.props.entityToMove?.position.get() ?? core_1.Vec3.zero;
        this.destPos = this.props.destPos?.position.get() ?? core_1.Vec3.zero;
    }
    playerEnterTrigger(player) {
        if (!this.playersInMe.includes(player)) {
            this.playersInMe.push(player);
        }
        if (this.props.entityToMove && this.playersInMe.length === 1) {
            UtilMotionOverTime_Func_1.overTime.moveTo.start(this.props.entityToMove, this.destPos, this.props.moveDurationMs);
        }
    }
    playerExitTrigger(player) {
        if (this.playersInMe.includes(player)) {
            UtilArray_Func_1.arrayUtils.removeItemFromArray(this.playersInMe, player);
        }
        if (this.props.entityToMove && this.playersInMe.length === 0) {
            UtilMotionOverTime_Func_1.overTime.moveTo.start(this.props.entityToMove, this.orgPos, this.props.moveDurationMs);
        }
    }
    playerExitWorld(player) {
        if (this.playersInMe.includes(player)) {
            this.playerExitTrigger(player);
        }
    }
}
DoorTrigger_Entity.propsDefinition = {
    entityToMove: { type: core_1.PropTypes.Entity },
    destPos: { type: core_1.PropTypes.Entity },
    moveDurationMs: { type: core_1.PropTypes.Number, default: 5000 },
};
core_1.Component.register(DoorTrigger_Entity);
