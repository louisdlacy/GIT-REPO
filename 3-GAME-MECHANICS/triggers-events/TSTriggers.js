"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
// Meta Documentation: https://developers.meta.com/horizon-worlds/learn/documentation/code-blocks-and-gizmos/use-the-trigger-zone
// Tutorial Video: https://youtu.be/055R1j4nzwM
// GitHub: https://github.com/Gausroth/HorizonWorldsTutorials
class TSTriggers extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (p) => this.OnPlayerEnterTrigger(p));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitTrigger, (p) => this.OnPlayerExitTrigger(p));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnEntityEnterTrigger, (obj) => this.OnEntityEnterTrigger(obj));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnEntityExitTrigger, (obj) => this.OnEntityExitTrigger(obj));
        this.connectCodeBlockEvent(this.entity, new core_1.CodeBlockEvent('Occupied', [core_1.PropTypes.Entity]), (obj) => this.OnEntityTriggerOccupied(obj));
        this.connectCodeBlockEvent(this.entity, new core_1.CodeBlockEvent('Empty', [core_1.PropTypes.Entity]), (obj) => this.OnEntityTriggerEmptied(obj));
    }
    start() { }
    OnPlayerEnterTrigger(player) {
        console.log(`Player ${player.name.get()} entered trigger.`);
    }
    OnPlayerExitTrigger(player) {
        console.log(`Player ${player.name.get()} exited trigger.`);
    }
    OnEntityEnterTrigger(entity) {
        this.entity.as(core_1.TriggerGizmo).enabled.set(false);
        console.log(`Entity ${entity.name.get()} entered trigger`);
    }
    OnEntityExitTrigger(entity) {
        console.log(`Entity ${entity.name.get()} exited trigger`);
    }
    OnEntityTriggerOccupied(entity) {
        console.log(`Tigger Occupied`);
    }
    OnEntityTriggerEmptied(entity) {
        console.log(`Tigger Emptied`);
    }
}
TSTriggers.propsDefinition = {};
core_1.Component.register(TSTriggers);
