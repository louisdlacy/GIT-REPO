"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const capturing_1 = require("horizon/capturing");
class TriggerInstantReplay extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
    }
    onPlayerEnterTrigger(player) {
        const capture = new capturing_1.PlayerCapturing(player.id);
        capture.startVideoCapture("InstantReplay").then(() => {
            console.log("Instant replay reached max time");
        }).catch((error) => {
            console.error("Something went wrong", error);
        });
    }
    start() { }
}
core_1.Component.register(TriggerInstantReplay);
