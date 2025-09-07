"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ControllerTriggerPressed extends core_1.Component {
    preStart() {
        // Set up button click handler
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnIndexTriggerDown, this.handlePressed.bind(this));
    }
    start() { }
    handlePressed() {
        console.log('Button was clicked!');
    }
}
core_1.Component.register(ControllerTriggerPressed);
