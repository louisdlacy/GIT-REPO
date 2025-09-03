"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class TextDisplay extends core_1.Component {
    preStart() {
        this.textGizmo = this.props.text?.as(core_1.TextGizmo);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterTrigger.bind(this));
    }
    start() { }
    onPlayerEnterTrigger(player) {
        this.textGizmo?.text.set("<color=red>Hello</color> <b>World</b>!");
    }
}
TextDisplay.propsDefinition = {
    text: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(TextDisplay);
