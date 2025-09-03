"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class RemoveCollidability extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
    }
    OnPlayerEnterTrigger() {
        this.props.collidable?.collidable.set(false);
    }
    start() { }
}
RemoveCollidability.propsDefinition = {
    collidable: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(RemoveCollidability);
