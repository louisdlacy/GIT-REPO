"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class NetworkSync extends core_1.Component {
    constructor() {
        super(...arguments);
        this.counter = 0;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onPlayerEnterTrigger() {
        this.counter++;
        console.log(`Counter is now: ${this.counter}`);
    }
}
core_1.Component.register(NetworkSync);
