"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PrintRandomNumber extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onGrab() {
        // This will print a random number between 0 and 1 to the console
        console.log(Math.random());
    }
}
core_1.Component.register(PrintRandomNumber);
